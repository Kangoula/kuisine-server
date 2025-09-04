import { Public } from '@/auth/decorators/public.decorator';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthService, CookieTypeNames } from './auth.service';
import { Response } from 'express';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from '@/users/users.service';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { ApiBody, ApiCookieAuth, ApiCreatedResponse } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { UserWithoutCredentials } from '@/users/dto/user-without-credentials.dto';
import { RequestUser } from '@/common/decorators';

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
    @RequestUser() user: UserWithoutCredentials,
    @Res({ passthrough: true }) response: Response,
  ) {
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
  @ApiCookieAuth(CookieTypeNames.Access)
  async logOut(
    @RequestUser() user: UserWithoutCredentials,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.usersService.removeRefreshToken(user.id);

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
  @ApiCookieAuth(CookieTypeNames.Access)
  authenticate(@RequestUser() user: UserWithoutCredentials) {
    return user;
  }

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  @ApiCookieAuth(CookieTypeNames.Access)
  refresh(
    @RequestUser() user: UserWithoutCredentials,
    @Res({ passthrough: true }) response: Response,
  ) {
    const accessTokenCookie =
      this.authService.getCookieParametersForAccessToken(user.id);

    response.cookie(
      accessTokenCookie.name,
      accessTokenCookie.token,
      accessTokenCookie.params,
    );
  }
}
