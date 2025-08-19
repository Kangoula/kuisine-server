import { User } from '@/users/entities/user.entity';
import { UsersService } from '@/users/users.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.usersService.findOneBy({
      username,
      password: await this.usersService.hashPassword(password),
    });

    if (user) {
      return user;
    }

    return null;
  }
}
