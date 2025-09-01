import {
  AbilityBuilder,
  createMongoAbility,
  InferSubjects,
  MongoAbility,
} from '@casl/ability';
import { Action } from './action.enum';
import { Injectable } from '@nestjs/common';
import { UserWithoutCredentials } from '@/users/dto/user-without-credentials.dto';
import { Permission } from '@/roles/entities/role.entity';
import { RolesService } from '@/roles/roles.service';
import { Constructor } from '@/common/types';
import { BaseEntity } from '@/common/entities';

type Subjects = InferSubjects<typeof BaseEntity>;

export type AppAbility = MongoAbility<[Action, Subjects]>;

// As of september 2025, in CASL v6, the subject type detection cannot match a class' name with a plain string.
//
// As stated in the doc https://casl.js.org/v6/en/guide/subject-type-detection
// and since we get abilities from the database, the ability's subject is defined as a string
// so the detectSubjectType function is not called
// therefore we need to built our own function to get the right subject
export const getSubjectFromClass = (
  entity: Constructor<BaseEntity> | string,
): string => {
  if (typeof entity === 'string') {
    return entity;
  }

  const construct = entity;
  return construct.name;
};

@Injectable()
export class CaslAbilityFactory {
  constructor(private readonly rolesService: RolesService) {}

  async createForUser(user: UserWithoutCredentials) {
    const { can, cannot, build } = new AbilityBuilder(createMongoAbility);

    const role = await this.rolesService.findOne(user.roleId);

    if (role.isAdmin) {
      can(Action.Manage, 'all'); // access to everything
    } else {
      const roleUserAbilities: Permission[] = role.permissions || [];

      roleUserAbilities.forEach((ability: Permission) => {
        let conditions = ability.conditions;
        if (conditions?.own === true) {
          //eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { own, ...rest } = conditions;
          conditions = Object.assign(rest, { userId: user.id });
        }

        if (ability.inverted) {
          cannot(ability.action, ability.subject, ability.fields, conditions);
        } else {
          can(ability.action, ability.subject, ability.fields, conditions);
        }
      });
    }

    return build();
  }
}
