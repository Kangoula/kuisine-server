import { registerDecorator, ValidationOptions } from 'class-validator';
import {
  IsUniqueContraintValidator,
  IsUniqueOptions,
} from '../validators/is-unique-contstraint.validator';

export function IsUnique(
  options: IsUniqueOptions,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsUnique',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [options],
      validator: IsUniqueContraintValidator,
    });
  };
}
