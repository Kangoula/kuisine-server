import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { EntityService } from '@/common/base-entity.service';
import { User } from './entities/user.entity';
import { hash as bcryptHash, compare as bcryptCompare } from 'bcrypt';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService extends EntityService<User> {
  constructor(public readonly repository: UsersRepository) {
    super(true);
  }

  async create(createUserDto: CreateUserDto) {
    const user = new User();
    user.username = createUserDto.username;
    user.password = await this.hashPassword(createUserDto.password);
    return this.repository.save(user);
  }

  private hashPassword(password: string): Promise<string> {
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
      select: ['password'],
    });

    return bcryptCompare(password, user.password);
  }
}
