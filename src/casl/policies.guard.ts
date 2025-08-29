import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { REQUIRED_ABILITY, RequiredAbility } from './check-abilities.decorator';
import { CaslAbilityFactory } from './casl-ability.factory';
import { ReqWithUser } from '@/common/decorators/request-user.decorator';
import { UserWithoutCredentials } from '@/users/dto/user-without-credentials.dto';

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

    return this.isActionAllowed(user, abilities);
  }

  private async isActionAllowed(
    user: UserWithoutCredentials,
    abilities: RequiredAbility | RequiredAbility[],
  ) {
    const userAbilities = await this.caslAbilityFactory.createForUser(user);

    if (Array.isArray(abilities)) {
      return abilities.every((ability) => {
        return userAbilities.can(ability.action, ability.subject);
      });
    }

    return userAbilities.can(
      abilities.action,
      abilities.subject,
      abilities.field,
    );
  }
}
