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

type Subjects = InferSubjects<typeof BaseEntity> | 'all';

export type AppAbility = MongoAbility<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: UserWithoutCredentials) {
    const { can, cannot, build } = new AbilityBuilder(createMongoAbility);

    if (user.role.name === 'Admin') {
      can(Action.Manage, 'all'); // read-write access to everything
    } else {
      const roleUserAbilities: Permission[] = [
        {
          subject: 'all',
          action: 'read',
        },
        {
          subject: 'Ingredient',
          action: 'create',
        },
        {
          subject: 'Ingredient',
          action: ['update', 'delete'],
          conditions: {
            own: true,
          },
        },
      ];

      // we can update or delete our own profile
      can(['update', 'delete'], 'User', { id: user.id });

      roleUserAbilities.forEach((ability: Permission) => {
        let conditions = ability.conditions;
        if (conditions?.own === true) {
          //eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { own, ...rest } = conditions;
          conditions = Object.assign(rest, { userId: user.id });
        }

        if (ability.inverted) {
          cannot(
            ability.action,
            ability.subject,
            ability.fields,
            ability.conditions,
          );
        } else {
          can(
            ability.action,
            ability.subject,
            ability.fields,
            ability.conditions,
          );
        }
      });
    }

    // TODO retrieve permissions from DB

    return build({
      // Read https://casl.js.org/v6/en/guide/subject-type-detection#use-classes-as-subject-types for details
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
