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
        },
        // ROLE : User
        {
          name: 'User',
          permissions: [
            {
              subject: 'User',
              action: 'read',
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
            },
            //
          ],
        },
      ])
      .execute();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
