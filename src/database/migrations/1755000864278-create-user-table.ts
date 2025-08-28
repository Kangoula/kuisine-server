import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';
import dataSource from '../data-source';
import { Permission, Role } from '@/roles/entities/role.entity';
import { Ingredient } from '@/ingredients/entities/ingredient.entity';
import { Action } from '@/casl/action.enum';

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
            type: 'json[]',
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
    await queryRunner.dropTable('user');
  }
}
