import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateUserTable1755000864278 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user',
        columns: [
          {
            name: 'id',
            type: 'int',
            isGenerated: true,
            isPrimary: true,
            generationStrategy: 'increment',
          },
          {
            name: 'username',
            type: 'varchar',
            precision: 255,
            isUnique: true,
          },
          {
            name: 'password',
            type: 'varchar',
            precision: 255,
            isNullable: true,
          },
          {
            name: 'refresh_token',
            type: 'varchar',
            precision: 255,
            isNullable: true,
          },
          {
            name: 'role_id',
            type: 'int',
          },
          {
            name: 'deleted_at',
            type: 'date',
            isNullable: true,
          },
        ],
      }),
    );

    // Roles
    await queryRunner.createTable(
      new Table({
        name: 'role',
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
            isUnique: true,
          },
          {
            name: 'permissions',
            type: 'json',
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

    await queryRunner.createForeignKey(
      'user',
      new TableForeignKey({
        name: 'user_role_foreign',
        columnNames: ['role_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'role',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('user', 'user_role_foreign');
    await queryRunner.dropTable('user');
    await queryRunner.dropTable('role');
  }
}
