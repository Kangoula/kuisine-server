import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { REQUIRED_ABILITY, RequiredAbility } from './check-abilities.decorator';

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const abilities = this.reflector.get<RequiredAbility[]>(
      REQUIRED_ABILITY,
      context.getHandler(),
    );

    // no check needed, action allowed
    if (!abilities) {
      return true;
    }

    console.log(abilities);

    return true;
  }
}
