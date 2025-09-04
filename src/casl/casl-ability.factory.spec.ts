import { Mocked } from '@suites/doubles.jest';
import { TestBed } from '@suites/unit';
import {
  CaslAbilityFactory,
  getSubjectFromClass,
} from './casl-ability.factory';
import { Ingredient } from '@/ingredients/entities/ingredient.entity';
import { RolesService } from '@/roles/roles.service';
import { User } from '@/users/entities/user.entity';
import { Action } from './action.enum';
import { Recipe } from '@/recipes/entities/recipe.entity';
import { Role } from '@/roles/entities/role.entity';
import { generateOne } from '~test-utils';

describe('CaslAbilityFactory', () => {
  let caslAbilityFactory: CaslAbilityFactory;
  let rolesService: Mocked<RolesService>;

  beforeEach(async () => {
    const { unit, unitRef } =
      await TestBed.solitary(CaslAbilityFactory).compile();

    caslAbilityFactory = unit;

    rolesService = unitRef.get(RolesService);
  });

  it('getSubjectFromClass should return constructor name when entity is a BaseEntity', () => {
    const result = getSubjectFromClass(Ingredient);

    expect(result).toBe('Ingredient');
  });

  it('getSubjectFromClass should return a string when entity is a string', () => {
    const result = getSubjectFromClass('Ingredient');

    expect(result).toBe('Ingredient');
  });

  it('should allow all actions when the role is Admin', async () => {
    const role = generateOne<Role>(Role, {
      isAdmin: true,
    });

    const user = generateOne<User>(User, { role });

    rolesService.findOne.mockResolvedValue(role);

    const abilities = await caslAbilityFactory.createForUser(user);

    expect(abilities.can(Action.Manage, 'all')).toBe(true);
    expect(abilities.can(Action.Update, getSubjectFromClass(Ingredient))).toBe(
      true,
    );
  });

  it("should allow only the role's permissions", async () => {
    const role = generateOne<Role>(Role, {
      permissions: [
        {
          subject: 'Ingredient',
          action: Action.Create,
        },
      ],
    });
    role.id = 1;

    const user = generateOne(User, { role });

    rolesService.findOne.mockResolvedValue(role);

    const abilities = await caslAbilityFactory.createForUser(user);

    expect(abilities.can(Action.Manage, 'all')).toBe(false);
    expect(abilities.can(Action.Update, getSubjectFromClass(Ingredient))).toBe(
      false,
    );
    expect(abilities.can(Action.Create, getSubjectFromClass(Ingredient))).toBe(
      true,
    );
  });

  it('should deny when permission.inverted is true', async () => {
    const role = generateOne(Role, {
      permissions: [
        {
          subject: 'Ingredient',
          action: Action.Create,
          inverted: true,
        },
      ],
    });
    role.id = 1;

    const user = generateOne(User, { role });

    rolesService.findOne.mockResolvedValue(role);

    const abilities = await caslAbilityFactory.createForUser(user);

    expect(abilities.can(Action.Create, getSubjectFromClass(Ingredient))).toBe(
      false,
    );
  });

  it('should allow when permission.condition.isOwner is true and the user id matches', async () => {
    const role = generateOne(Role, {
      permissions: [
        {
          subject: 'Recipe',
          action: Action.Update,
          conditions: {
            isOwner: true,
          },
        },
      ],
    });
    role.id = 1;

    const user = generateOne(User, { role });
    user.id = 1;

    const recipe: Recipe = generateOne(Recipe, { user });

    rolesService.findOne.mockResolvedValue(role);

    const abilities = await caslAbilityFactory.createForUser(user);

    expect(rolesService.findOne).toHaveBeenCalledWith(role.id);
    expect(abilities.can(Action.Update, recipe)).toBe(true);
  });

  it("should deny when permission.condition.isOwner is true and the user id doesn't match", async () => {
    const role = generateOne(Role, {
      permissions: [
        {
          subject: 'Recipe',
          action: Action.Update,
          conditions: {
            isOwner: true,
          },
        },
      ],
    });
    role.id = 1;

    const user = generateOne(User, { role });
    user.id = 1;

    const otherUserRecipe = generateOne(Recipe, { userId: 2 });

    rolesService.findOne.mockResolvedValue(role);

    const abilities = await caslAbilityFactory.createForUser(user);

    expect(abilities.can(Action.Update, otherUserRecipe)).toBe(false);
  });

  it('should allow when permission.condition.isMe is true and the user id matches', async () => {
    const role = generateOne(Role, {
      permissions: [
        {
          subject: 'User',
          action: Action.Update,
          conditions: {
            isMe: true,
          },
        },
      ],
    });
    role.id = 1;

    const user = generateOne(User, { role });

    rolesService.findOne.mockResolvedValue(role);

    const abilities = await caslAbilityFactory.createForUser(user);

    expect(abilities.can(Action.Update, user)).toBe(true);
  });

  it("should deny when permission.condition.isMe is true and the user id doesn't match", async () => {
    const role = generateOne(Role, {
      permissions: [
        {
          subject: 'User',
          action: Action.Update,
          conditions: {
            isMe: true,
          },
        },
      ],
    });
    role.id = 1;

    const currentUser = generateOne(User, {
      role,
    });
    currentUser.id = 1;

    rolesService.findOne.mockResolvedValue(role);

    const abilities = await caslAbilityFactory.createForUser(currentUser);

    const userToModify = generateOne(User, {
      role,
    });
    userToModify.id = 2;

    expect(abilities.can(Action.Update, userToModify)).toBe(false);
  });

  it('should allow when no permission.condition is not defined', async () => {
    const role = generateOne(Role, {
      permissions: [
        {
          subject: 'Recipe',
          action: Action.Read,
        },
      ],
    });
    role.id = 1;

    const user = generateOne(User, { role });

    const recipe = generateOne(Recipe, { userId: 2 });

    rolesService.findOne.mockResolvedValue(role);

    const abilities = await caslAbilityFactory.createForUser(user);

    expect(abilities.can(Action.Read, recipe)).toBe(true);
    expect(abilities.can(Action.Read, getSubjectFromClass(Recipe))).toBe(true);
  });
});
