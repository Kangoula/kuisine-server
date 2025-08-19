import { User } from '@/users/entities/user.entity';
import { UsersService } from '@/users/users.service';
import { Injectable } from '@nestjs/common';
import { compare } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(public usersService: UsersService) {}

  public async validateUser(
    username: string,
    password: string,
  ): Promise<User | null> {
    const user = await this.usersService.findOneBy({ username });

    if (user) {
      const isPasswordValid =
        await this.usersService.comparePasswordWithStoredHash(
          user.id,
          password,
        );

      if (isPasswordValid) {
        return user;
      }
    }

    return null;
  }
}
