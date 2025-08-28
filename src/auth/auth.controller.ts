import { Public } from '@/auth/decorators/public.decorator';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService } from './auth.service';
import { ReqWithUser } from '@/common/types';
import { Response } from 'express';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from '@/users/users.service';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { ApiBody, ApiCreatedResponse } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { UserWithoutCredentials } from '@/users/dto/user-without-credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: LoginDto })
  async logIn(
    @Request() req: ReqWithUser,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { user } = req;

    const accessTokenCookie =
      this.authService.getCookieParametersForAccessToken(user.id);
    const refreshTokenCookie =
      this.authService.getCookieParametersForRefreshToken(user.id);

    await this.usersService.setCurrentRefreshToken(
      user.id,
      refreshTokenCookie.token,
    );

    response.cookie(
      accessTokenCookie.name,
      accessTokenCookie.token,
      accessTokenCookie.params,
    );
    response.cookie(
      refreshTokenCookie.name,
      refreshTokenCookie.token,
      refreshTokenCookie.params,
    );

    return user;
  }

  @Public()
  @Post('register')
  @ApiCreatedResponse({ type: UserWithoutCredentials })
  async register(@Body() registrationData: RegisterDto) {
    return this.authService.register(registrationData);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logOut(
    @Request() req: ReqWithUser,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.usersService.removeRefreshToken(req.user.id);

    const accessLogoutCookie =
      this.authService.getLogoutCookieParametersForAccessToken();
    const refreshLogoutCookie =
      this.authService.getLogoutCookieParametersForRefreshToken();

    response.cookie(
      accessLogoutCookie.name,
      accessLogoutCookie.token,
      accessLogoutCookie.params,
    );
    response.cookie(
      refreshLogoutCookie.name,
      refreshLogoutCookie.token,
      refreshLogoutCookie.params,
    );
  }

  @Get('me')
  authenticate(@Request() request: ReqWithUser) {
    const user = request.user;
    return user;
  }

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  refresh(
    @Request() req: ReqWithUser,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { user } = req;
    const accessTokenCookie =
      this.authService.getCookieParametersForAccessToken(user.id);

    response.cookie(
      accessTokenCookie.name,
      accessTokenCookie.token,
      accessTokenCookie.params,
    );
  }
}
