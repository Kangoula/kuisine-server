import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { UsersService } from '@/users/users.service';
import { TokenPayload } from '../tokenPayload.interface';
import { CookieTypeNames } from '../auth.service';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return this.getRefreshTokenFromCookie(request);
        },
      ]),
      passReqToCallback: true,
      secretOrKey: configService.get('auth.refreshToken.secret') as string,
    });
  }

  async validate(request: Request, payload: TokenPayload) {
    const refreshToken = this.getRefreshTokenFromCookie(request);
    return this.userService.getUserMatchingRefreshToken(
      payload.userId,
      refreshToken,
    );
  }

  private getRefreshTokenFromCookie(req: Request) {
    return req?.cookies?.[CookieTypeNames.Refresh] as string;
  }
}
