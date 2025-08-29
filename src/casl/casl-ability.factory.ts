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
      can(Action.Manage, 'all'); // read-write access to everything
    } else {
      const roleUserAbilities: Permission[] = [
        {
          subject: 'User',
          action: 'read',
        },
        //
        {
          subject: 'Ingredient',
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
        {
          subject: 'Ingredient',
          action: ['update', 'delete'],
          conditions: {
            ingredientToRecipe: { $size: 0 },
          },
        },
        //
        {
          subject: 'Recipe',
          action: 'read',
        },
        {
          subject: 'Recipe',
          action: 'create',
        },
        {
          subject: 'Recipe',
          action: ['update', 'delete'],
          conditions: {
            own: true,
          },
        },
        //
        {
          subject: 'RecipeStep',
          action: 'read',
        },
        {
          subject: 'RecipeStep',
          action: 'create',
        },
        {
          subject: 'RecipeStep',
          action: ['update', 'delete'],
          conditions: {
            own: true,
          },
        },
      ];

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
