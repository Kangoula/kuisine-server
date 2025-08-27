import { User } from '@/users/entities/user.entity';
import { UsersService } from '@/users/users.service';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare as bcryptCompare } from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { bcryptHash } from '@/common/helpers/bcryptHash';
import { TokenPayload } from './tokenPayload.interface';
import { ConfigService } from '@nestjs/config';
import { PostgresErrorCode } from '@/database/postgresErrorCodes.enum';
import { CookieOptions } from 'express';
import * as ms from 'ms';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  public async validateUser(username: string, password: string) {
    try {
      const user = await this.usersService.findByUsernameWithPassword(username);

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

  public async register(registerData: RegisterDto) {
    const hashedPassword = await bcryptHash(registerData.password);

    try {
      const createdUser = (await this.usersService.create({
        ...registerData,
        password: hashedPassword,
      })) as Partial<User>;
      createdUser.password = undefined;
      return createdUser;
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new BadRequestException(
          'A User with this username already exists',
        );
      }

      throw new InternalServerErrorException();
    }
  }

  public getJwtToken(userId: number) {
    const payload: TokenPayload = { userId };

    return this.jwtService.sign(payload);
  }

  public getLoginCookieOptions(): CookieOptions {
    return {
      maxAge: ms(
        this.configService.get('JWT_ACCESS_EXPIRATION_TIME') as ms.StringValue,
      ),
      httpOnly: true,
      path: '/',
    };
  }

  public getLogoutCookieOptions(): CookieOptions {
    return {
      maxAge: 0,
      httpOnly: true,
      path: '/',
    };
  }

  public getAccessToken(userId: number) {
    return {
      access_token: this.getJwtToken(userId),
    };
  }

  public getCookieForLogOut() {
    return `Authentication=; HttpOnly; Path=/; Max-Age=0`;
  }
}
