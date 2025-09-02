import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { REQUIRED_ABILITY, RequiredAbility } from './permission.decorator';
import {
  CaslAbilityFactory,
  getSubjectFromClass,
} from './casl-ability.factory';
import { ReqWithUser } from '@/common/decorators/request-user.decorator';
import { UserWithoutCredentials } from '@/users/dto/user-without-credentials.dto';
import { EntityManager } from 'typeorm';
import { BaseEntity } from '@/common/entities';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private caslAbilityFactory: CaslAbilityFactory,
    private readonly entityManager: EntityManager,
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

    const { user, entityId } = this.retrieveRequiredParamsFromContext(context);

    return this.isActionAllowed(user, abilities, entityId);
  }

  private async isActionAllowed(
    user: UserWithoutCredentials,
    abilities: RequiredAbility | RequiredAbility[],
    entityId?: number,
  ) {
    const userAbilities = await this.caslAbilityFactory.createForUser(user);

    if (Array.isArray(abilities)) {
      return abilities.every((ability) => {
        return userAbilities.can(
          ability.action,
          this.getAbilitySubject(ability, entityId),
          ability.field,
        );
      });
    }

    return userAbilities.can(
      abilities.action,
      this.getAbilitySubject(abilities),
      abilities.field,
    );
  }

  private retrieveRequiredParamsFromContext(context: ExecutionContext) {
    const request: ReqWithUser & { params: { id: number } } = context
      .switchToHttp()
      .getRequest();

    const user = request.user;
    const entityId = request.params?.id ? +request.params.id : undefined;

    return { user, entityId };
  }

  /**
   * When the given ability is field level grained and and entityId is given,
   * retrieves the entity from the database to be able to check permissions.
   *
   * Otherwise retrives the subject as a string
   */
  private getAbilitySubject(
    ability: RequiredAbility,
    entityId?: number,
  ): string | Promise<BaseEntity> {
    const subject = ability.subject;

    if (!entityId || !ability.field) {
      return getSubjectFromClass(subject);
    }

    return this.entityManager
      .getRepository(subject)
      .createQueryBuilder(getSubjectFromClass(subject))
      .where({ id: entityId })
      .execute();
  }
}
