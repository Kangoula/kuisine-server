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

type Subjects = InferSubjects<typeof BaseEntity> | 'all';

export type AppAbility = MongoAbility<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: UserWithoutCredentials) {
    const { can, cannot, build } = new AbilityBuilder(createMongoAbility);

    if (user.role.name === 'Admin') {
      can(Action.Manage, 'all'); // read-write access to everything
    }

    // TODO retrieve permissions from DB

    return build({
      // Read https://casl.js.org/v6/en/guide/subject-type-detection#use-classes-as-subject-types for details
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
