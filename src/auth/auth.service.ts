import { User } from '@/users/entities/user.entity';
import { UsersService } from '@/users/users.service';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

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

  public async login(user: User) {
    return {
      access_token: this.jwtService.sign({
        username: user.username,
        sub: user.id,
      }),
    };
  }
}
