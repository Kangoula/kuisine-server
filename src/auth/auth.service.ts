import { User } from '@/users/entities/user.entity';
import { UsersService } from '@/users/users.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(public usersService: UsersService) {}

  public async validateUser(
    username: string,
    password: string,
  ): Promise<boolean> {
    const user = await this.usersService.findOneBy({
      username,
      password: await this.usersService.hashPassword(password),
    });

    return Boolean(user);
  }
}
