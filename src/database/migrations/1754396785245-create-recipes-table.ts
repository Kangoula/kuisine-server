import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateRecipesTable1754396785245 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'recipe',
        columns: [
          {
            name: 'id',
            type: 'int',
            isGenerated: true,
            isPrimary: true,
            generationStrategy: 'increment',
          },
          {
            name: 'name',
            type: 'varchar',
            precision: 255,
          },
          {
            name: 'servings',
            type: 'smallint',
          },
          {
            name: 'cooking_duration_minutes',
            type: 'smallint',
          },
          {
            name: 'preparation_duration_minutes',
            type: 'smallint',
          },
          {
            name: 'deleted_at',
            type: 'date',
            isNullable: true,
          },
        ],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'ingredient',
        columns: [
          {
            name: 'id',
            type: 'int',
            isGenerated: true,
            isPrimary: true,
            generationStrategy: 'increment',
          },
          {
            name: 'name',
            type: 'varchar',
            precision: 255,
          },
          {
            name: 'full_text_search',
            type: 'tsvector',
            isNullable: true,
          },
          {
            name: 'deleted_at',
            type: 'date',
            isNullable: true,
          },
        ],
      }),
    );

    await queryRunner.query(`
        CREATE INDEX "IDX_ingredient_full_text_search" 
        ON "ingredient" 
        USING GIN ("full_text_search");
    `);

    await queryRunner.createTable(
      new Table({
        name: 'recipe_step',
        columns: [
          {
            name: 'id',
            type: 'int',
            isGenerated: true,
            isPrimary: true,
            generationStrategy: 'increment',
          },
          {
            name: 'recipe_id',
            type: 'int',
          },
          {
            name: 'order',
            type: 'smallint',
          },
          {
            name: 'description',
            type: 'text',
          },
          {
            name: 'deleted_at',
            type: 'date',
            isNullable: true,
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'recipe_step',
      new TableForeignKey({
        name: 'recipe_step_recipe_foreign',
        columnNames: ['recipe_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'recipe',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'ingredient_to_recipe',
        columns: [
          {
            name: 'id',
            type: 'int',
            isGenerated: true,
            isPrimary: true,
            generationStrategy: 'increment',
          },
          {
            name: 'ingredient_id',
            type: 'int',
          },
          {
            name: 'recipe_id',
            type: 'int',
          },
          {
            name: 'order',
            type: 'smallint',
          },
          {
            name: 'quantity',
            type: 'smallint',
          },
          {
            name: 'quantity_unit',
            type: 'varchar',
            isNullable: true,
            precision: 255,
          },
          {
            name: 'deleted_at',
            type: 'date',
            isNullable: true,
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'ingredient_to_recipe',
      new TableForeignKey({
        name: 'ingredient_to_recipe_recipe_foreign',
        columnNames: ['recipe_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'recipe',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'ingredient_to_recipe',
      new TableForeignKey({
        name: 'ingredient_to_recipe_ingredient_foreign',
        columnNames: ['ingredient_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'ingredient',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      'ingredient_to_recipe',
      'ingredient_to_recipe_ingredient_foreign',
    );
    await queryRunner.dropForeignKey(
      'ingredient_to_recipe',
      'ingredient_to_recipe_recipe_foreign',
    );
    await queryRunner.dropIndex(
      'ingredient',
      'IDX_ingredient_full_text_search',
    );
    await queryRunner.dropTable('ingredient_to_recipe');
    await queryRunner.dropTable('recipe_step');
    await queryRunner.dropTable('ingredient');
    await queryRunner.dropTable('recipe');
  }
}
