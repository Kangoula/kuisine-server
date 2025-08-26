import { Public } from '@/common/decorators/public.decorator';
import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { ReqWithUser } from '@/common/types';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req: ReqWithUser) {
    return this.authService.login(req.user);
  }
}
