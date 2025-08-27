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

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  logIn(@Request() req: ReqWithUser, @Res() response: Response) {
    const { user } = req;
    const cookie = this.authService.getCookieWithJwtToken(user.id);
    response.setHeader('Set-Cookie', cookie);
    response.send();
  }

  @Public()
  @Post('register')
  async register(@Body() registrationData: RegisterDto) {
    return this.authService.register(registrationData);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logOut(@Request() request: ReqWithUser, @Res() response: Response) {
    response.setHeader('Set-Cookie', this.authService.getCookieForLogOut());
    response.send();
  }

  @Get('me')
  authenticate(@Request() request: ReqWithUser) {
    const user = request.user;
    return user;
  }
}
