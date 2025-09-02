import { In, MigrationInterface, QueryRunner } from 'typeorm';
import { Role } from '@/roles/entities/role.entity';

export class InsertRolesAndPermissions1756806691564
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.getRepository(Role).insert([
      {
        name: 'Admin',
        isAdmin: true,
      },

      {
        name: 'User',
        permissions: [
          //
          // User
          //
          {
            subject: 'User',
            action: 'read',
          },
          {
            subject: 'User',
            action: 'update',
            fields: ['username', 'password'],
            conditions: {
              isMe: true,
            },
          },
          //
          // Ingredient
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
              isOwner: true,
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
          // Recipe
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
              isOwner: true,
            },
          },
          //
          // RecipeStep
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
              isOwner: true,
            },
          }, //
          // IngredientToRecipe
          //
          {
            subject: 'IngredientToRecipe',
            action: 'read',
          },
          {
            subject: 'IngredientToRecipe',
            action: ['update', 'delete'],
            conditions: {
              isOwner: true,
            },
          },
        ],
      },
      {
        name: 'Guest',
        permissions: [
          {
            subject: 'Recipe',
            action: 'read',
          },
          {
            subject: 'Ingredient',
            action: 'read',
          },
          {
            subject: 'RecipeStep',
            action: 'read',
          },
          {
            subject: 'IngredientToRecipe',
            action: 'read',
          },
          {
            subject: 'User',
            action: 'read',
          },
        ],
      },
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.delete('role', {
      name: In(['Admin', 'User', 'Guest']),
    });
  }
}
