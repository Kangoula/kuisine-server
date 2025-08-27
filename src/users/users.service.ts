import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { BaseEntityService } from '@/common/base-entity.service';
import { User } from './entities/user.entity';

type UserWithoutPassword = Omit<User, 'password'>;

@Injectable()
export class UsersService extends BaseEntityService(User) {
  async create(createUserDto: CreateUserDto): Promise<UserWithoutPassword> {
    const user = new User();
    user.username = createUserDto.username;
    user.password = createUserDto.password;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...createdUser } = await this.repository.save(user);

    return createdUser;
  }

  public findByUsernameWithPassword(username: string) {
    return this.repository.findOneOrFail({
      where: { username },
      // the password column default behavior makes it not selectable, we have to add an explicit selection to retrieve it
      select: ['id', 'username', 'password'],
    });
  }

  findByUsername(username: string) {
    return this.repository.findOneByOrFail({ username });
  }
}
