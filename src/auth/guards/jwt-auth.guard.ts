import { IS_PULBIC_KEY } from '@/auth/decorators/public.decorator';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPulic = this.reflector.getAllAndOverride<boolean>(IS_PULBIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPulic) {
      return true;
    }

    return super.canActivate(context);
  }
}
