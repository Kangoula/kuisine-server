import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { BaseEntityService } from '@/common/base-entity.service';
import { User } from './entities/user.entity';
import { hash as bcryptHash, compare as bcryptCompare } from 'bcrypt';

@Injectable()
export class UsersService extends BaseEntityService(User) {
  async create(createUserDto: CreateUserDto) {
    const user = new User();
    user.username = createUserDto.username;
    user.password = await this.hashPassword(createUserDto.password);
    return this.repository.save(user);
  }

  public hashPassword(password: string): Promise<string> {
    // TODO: à mettre dans la config
    const saltRounds = 10;
    return bcryptHash(password, saltRounds);
  }

  public async comparePasswordWithStoredHash(
    userId: number,
    password: string,
  ): Promise<boolean> {
    const user = await this.repository.findOneOrFail({
      where: { id: userId },
      select: ['id', 'password'],
    });

    return bcryptCompare(password, user.password);
  }
}
