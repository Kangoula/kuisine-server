import { UsersService } from '@/users/users.service';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare as bcryptCompare } from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { TokenPayload } from './tokenPayload.interface';
import { ConfigService } from '@nestjs/config';
import { PostgresErrorCode } from '@/database/postgresErrorCodes.enum';
import { CookieOptions } from 'express';
import * as ms from 'ms';

export enum CookieTypeNames {
  Refresh = 'Refresh',
  Access = 'Authentication',
}

export type JwtCookieParams = {
  name: CookieTypeNames;
  token: string;
  params: CookieOptions;
};

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
    try {
      const createdUser = await this.usersService.create(registerData);
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

  public getCookieParametersForAccessToken(userId: number): JwtCookieParams {
    const secret = this.configService.get(`auth.accessToken.secret`) as string;
    const expirationTime = this.configService.get(
      `auth.accessToken.expirationTime`,
    ) as string;

    return {
      name: CookieTypeNames.Access,
      token: this.getJwtToken(userId, secret, expirationTime),
      params: {
        maxAge: ms(expirationTime as ms.StringValue),
        httpOnly: true,
        path: '/',
      },
    };
  }

  public getCookieParametersForRefreshToken(userId: number): JwtCookieParams {
    const secret = this.configService.get(`auth.refreshToken.secret`) as string;
    const expirationTime = this.configService.get(
      `auth.refreshToken.expirationTime`,
    ) as string;

    return {
      name: CookieTypeNames.Refresh,
      token: this.getJwtToken(userId, secret, expirationTime),
      params: {
        maxAge: ms(expirationTime as ms.StringValue),
        httpOnly: true,
        path: '/auth',
      },
    };
  }

  private getJwtToken(userId: number, secret: string, expiresIn: string) {
    const payload: TokenPayload = { userId };

    return this.jwtService.sign(payload, { secret, expiresIn });
  }

  // TODO
  public getLogoutCookieOptions(): CookieOptions {
    return {
      maxAge: 0,
      httpOnly: true,
      path: '/',
    };
  }

  public getAccessToken(userId: number) {
    return {
      access_token: this.getJwtToken(
        userId,
        this.configService.get('auth.accessToken.secret') as string,
        this.configService.get('auth.accessToken.expirationTime') as string,
      ),
    };
  }
}
