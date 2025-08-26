import { User } from '@/users/entities/user.entity';
import { UsersService } from '@/users/users.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare as bcryptCompare } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  public async validateUser(username: string, password: string) {
    try {
      const user = await this.usersService.findOneBy({ username });

      if (user) {
        await this.verifyPassword(user.password, password);

        return user;
      }
    } catch {
      throw new BadRequestException('Wrong credentials provided');
    }
  }

  private async verifyPassword(userPassword: string, givenPassword: string) {
    const isPasswordValid = await bcryptCompare(givenPassword, userPassword);

    if (!isPasswordValid) {
      throw new BadRequestException('Wrong credentials provided');
    }
  }

  public login(user: User) {
    return {
      access_token: this.jwtService.sign({
        username: user.username,
        sub: user.id,
      }),
    };
  }
}
