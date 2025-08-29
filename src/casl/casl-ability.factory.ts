import {
  AbilityBuilder,
  createMongoAbility,
  ExtractSubjectType,
  InferSubjects,
  MongoAbility,
} from '@casl/ability';
import { Action } from './action.enum';
import { BaseEntity } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { UserWithoutCredentials } from '@/users/dto/user-without-credentials.dto';
import { Permission } from '@/roles/entities/role.entity';
import { RolesService } from '@/roles/roles.service';

type Subjects = InferSubjects<typeof BaseEntity> | 'all';

export type AppAbility = MongoAbility<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  constructor(private readonly rolesService: RolesService) {}
  async createForUser(user: UserWithoutCredentials) {
    const { can, cannot, build } = new AbilityBuilder(createMongoAbility);

    const role = await this.rolesService.findOne(user.roleId);

    if (role.name === 'Admin') {
      can(Action.Manage, 'all'); // access to everything
    } else {
      // TODO retrieve permissions from DB
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

    return build({
      // Read https://casl.js.org/v6/en/guide/subject-type-detection#use-classes-as-subject-types for details
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
