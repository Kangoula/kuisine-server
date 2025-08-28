import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { REQUIRED_ABILITY, RequiredAbility } from './check-abilities.decorator';
import { CaslAbilityFactory } from './casl-ability.factory';
import { ReqWithUser } from '@/common/decorators/request-user.decorator';

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

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

    const request: ReqWithUser = context.switchToHttp().getRequest();
    const user = request.user;

    const userAbilities = this.caslAbilityFactory.createForUser(user);

    return abilities.every((ability) => {
      return userAbilities.can(ability.action, ability.subject);
    });

    return true;
  }
}
