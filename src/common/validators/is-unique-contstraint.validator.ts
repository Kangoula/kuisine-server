import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { EntityManager } from 'typeorm';
import { Constructor } from '../types';

export type IsUniqueOptions = Constructor | { table: string; column: string };

@ValidatorConstraint({ name: 'IsUniqueContraintValidator', async: true })
@Injectable()
export class IsUniqueContraintValidator
  implements ValidatorConstraintInterface
{
  constructor(private readonly entityManager: EntityManager) {}

  async validate(
    value: any,
    validationArguments: ValidationArguments,
  ): Promise<boolean> {
    const table = this.getTableName(validationArguments);
    const column = this.getTableColumn(validationArguments);

    // check data is exists in db
    const exists = await this.entityManager
      .getRepository(table)
      .createQueryBuilder(table)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      .where({ [column]: value })
      .getExists();

    return !exists;
  }

  defaultMessage(validationArguments: ValidationArguments): string {
    // return custom field message
    const column: string = this.getTableColumn(validationArguments);
    return `${column} already exists`;
  }

  private getTableName(validationArguments: ValidationArguments) {
    const validationOptions = validationArguments
      .constraints[0] as IsUniqueOptions;

    if ('table' in validationOptions) {
      return validationOptions.table;
    }

    return validationArguments.constraints[0].name as string;
  }

  private getTableColumn(validationArguments: ValidationArguments) {
    const validationOptions = validationArguments
      .constraints[0] as IsUniqueOptions;

    if ('column' in validationOptions) {
      return validationOptions.column;
    }

    return validationArguments.property;
  }
}
