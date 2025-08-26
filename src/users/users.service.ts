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
}
