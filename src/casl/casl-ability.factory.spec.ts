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
    const adminRoleId = 1;

    const user = new User();
    user.username = 'test';
    user.roleId = adminRoleId;

    rolesService.findOne.mockResolvedValue({
      id: adminRoleId,
      name: 'Admin',
      isAdmin: true,
      users: [user],
    });

    const abilities = await caslAbilityFactory.createForUser(user);

    expect(abilities.can(Action.Manage, 'all')).toBe(true);
    expect(abilities.can(Action.Update, getSubjectFromClass(Ingredient))).toBe(
      true,
    );
  });

  it("should allow only the role's permissions", async () => {
    const roleId = 1;

    const user = new User();
    user.username = 'test';
    user.roleId = roleId;

    rolesService.findOne.mockResolvedValue({
      id: roleId,
      name: 'User',
      isAdmin: false,
      permissions: [
        {
          subject: 'Ingredient',
          action: Action.Create,
        },
      ],
      users: [user],
    });

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
    const roleId = 1;

    const user = new User();
    user.username = 'test';
    user.roleId = roleId;

    rolesService.findOne.mockResolvedValue({
      id: roleId,
      name: 'User',
      isAdmin: false,
      permissions: [
        {
          subject: 'Ingredient',
          action: Action.Create,
          inverted: true,
        },
      ],
      users: [user],
    });

    const abilities = await caslAbilityFactory.createForUser(user);

    expect(abilities.can(Action.Create, getSubjectFromClass(Ingredient))).toBe(
      false,
    );
  });

  it('should allow when permission.condition.isOwner is true and the user id matches', async () => {
    const roleId = 1;

    const user = new User();
    user.id = 1;
    user.username = 'test';
    user.roleId = roleId;

    const recipe = new Recipe();
    recipe.userId = user.id;

    rolesService.findOne.mockResolvedValue({
      id: roleId,
      name: 'User',
      isAdmin: false,
      permissions: [
        {
          subject: 'Recipe',
          action: Action.Update,
          conditions: {
            isOwner: true,
          },
        },
      ],
      users: [user],
    });

    const abilities = await caslAbilityFactory.createForUser(user);

    expect(abilities.can(Action.Update, recipe)).toBe(true);
  });

  it("should deny when permission.condition.isOwner is true and the user id doesn't match", async () => {
    const roleId = 1;

    const user = new User();
    user.id = 1;
    user.username = 'test';
    user.roleId = roleId;

    const recipe = new Recipe();
    recipe.userId = 2;

    rolesService.findOne.mockResolvedValue({
      id: roleId,
      name: 'User',
      isAdmin: false,
      permissions: [
        {
          subject: 'Recipe',
          action: Action.Update,
          conditions: {
            isOwner: true,
          },
        },
      ],
      users: [user],
    });

    const abilities = await caslAbilityFactory.createForUser(user);

    expect(abilities.can(Action.Update, recipe)).toBe(false);
  });

  it('should allow when permission.condition.isMe is true and the user id matches', async () => {
    const roleId = 1;

    const user = new User();
    user.id = 1;
    user.username = 'test';
    user.roleId = roleId;

    rolesService.findOne.mockResolvedValue({
      id: roleId,
      name: 'User',
      isAdmin: false,
      permissions: [
        {
          subject: 'User',
          action: Action.Update,
          conditions: {
            isMe: true,
          },
        },
      ],
      users: [user],
    });

    const abilities = await caslAbilityFactory.createForUser(user);

    expect(abilities.can(Action.Update, user)).toBe(true);
  });

  it("should deny when permission.condition.isMe is true and the user id doesn't match", async () => {
    const roleId = 1;

    const currentUser = new User();
    currentUser.id = 1;
    currentUser.username = 'test';
    currentUser.roleId = roleId;

    rolesService.findOne.mockResolvedValue({
      id: roleId,
      name: 'User',
      isAdmin: false,
      permissions: [
        {
          subject: 'User',
          action: Action.Update,
          conditions: {
            isMe: true,
          },
        },
      ],
      users: [currentUser],
    });

    const abilities = await caslAbilityFactory.createForUser(currentUser);

    const userToModify = new User();
    userToModify.id = 2;
    userToModify.username = 'test';
    userToModify.roleId = roleId;

    expect(abilities.can(Action.Update, userToModify)).toBe(false);
  });

  it('should allow when no permission.condition is not defined', async () => {
    const roleId = 1;

    const user = new User();
    user.id = 1;
    user.username = 'test';
    user.roleId = roleId;

    const recipe = new Recipe();
    recipe.userId = 2;

    rolesService.findOne.mockResolvedValue({
      id: roleId,
      name: 'User',
      isAdmin: false,
      permissions: [
        {
          subject: 'Recipe',
          action: Action.Read,
        },
      ],
      users: [user],
    });

    const abilities = await caslAbilityFactory.createForUser(user);

    expect(abilities.can(Action.Read, recipe)).toBe(true);
    expect(abilities.can(Action.Read, getSubjectFromClass(Recipe))).toBe(true);
  });
});
