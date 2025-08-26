import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { BaseEntityService } from '@/common/base-entity.service';
import { User } from './entities/user.entity';
import { compare as bcryptCompare } from 'bcrypt';
import { bcryptHash } from '@/common/helpers/bcryptHash';

@Injectable()
export class UsersService extends BaseEntityService(User) {
  async create(createUserDto: CreateUserDto) {
    const user = new User();
    user.username = createUserDto.username;
    user.password = await this.hashPassword(createUserDto.password);
    return this.repository.save(user);
  }

  private hashPassword(password: string): Promise<string> {
    return bcryptHash(password);
  }

  public async comparePasswordWithStoredHash(
    userId: number,
    password: string,
  ): Promise<boolean> {
    const user = await this.findOneBy({
      where: { id: userId },
      select: ['password'],
    });

    return bcryptCompare(password, user.password);
  }
}
