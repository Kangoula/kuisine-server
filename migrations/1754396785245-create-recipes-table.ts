import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateRecipesTable1754396785245 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'recipe',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
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
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('recipe');
  }
}
