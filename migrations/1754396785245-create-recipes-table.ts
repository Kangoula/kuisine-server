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
            unsigned: true,
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
            unsigned: true,
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
        columnNames: ['recipe_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'recipe',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('recipe_step');
    await queryRunner.dropTable('ingredient');
    await queryRunner.dropTable('recipe');
  }
}
