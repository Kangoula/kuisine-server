import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '@/users/users.service';
import { Request } from 'express';
import { TokenPayload } from '../tokenPayload.interface';
import { CookieTypeNames } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      // extract jwt from cookie or from Bearer Token
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return this.getAcessTokenFromCookie(request);
        },
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_ACCESS_SECRET') as string,
    });
  }

  validate(payload: TokenPayload) {
    return this.usersService.findOne(payload.userId);
  }

  private getAcessTokenFromCookie(req: Request) {
    return req?.cookies?.[CookieTypeNames.Access] as string;
  }
}
