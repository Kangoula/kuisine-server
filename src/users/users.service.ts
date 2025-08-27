import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { BaseEntityService } from '@/common/base-entity.service';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService extends BaseEntityService(User) {
  async create(createUserDto: CreateUserDto) {
    const user = new User();
    user.username = createUserDto.username;
    user.password = createUserDto.password;
    return this.repository.save(user);
  }

  public findByUsernameWithPassword(username: string) {
    return this.repository.findOneOrFail({
      where: { username },

      select: ['id', 'username', 'password'], // the password column default behavior makes it not selectable, we have to add an explicit selection to retrieve it
    });
  }

  findByUsername(username: string) {
    return this.repository.findOneByOrFail({ username });
  }
}
