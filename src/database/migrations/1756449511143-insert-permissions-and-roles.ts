import { MigrationInterface, QueryRunner } from 'typeorm';
import dataSource from '../data-source';
import { Role } from '@/roles/entities/role.entity';

export class InsertPermissionsAndRoles1756449511143
  implements MigrationInterface
{
  public async up(): Promise<void> {
    await dataSource
      .createQueryBuilder()
      .insert()
      .into(Role)
      .values([
        {
          name: 'Admin',
          isAdmin: true,
        },
        {
          name: 'User',
          permissions: [
            {
              subject: 'User',
              action: 'read',
            },
            {
              subject: 'User',
              action: 'update',
              fields: ['username', 'password'],
              conditions: {
                own: true,
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
                own: true,
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
                own: true,
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
                own: true,
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
      ])
      .execute();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
