import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { BaseEntityService } from '@/common/base-entity.service';
import { User } from './entities/user.entity';
import { hash as bcryptHash } from 'bcrypt';

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
}
