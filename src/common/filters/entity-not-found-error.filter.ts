import { Catch, ExceptionFilter, NotFoundException } from '@nestjs/common';
import { EntityNotFoundError } from 'typeorm';

// TODO à remplacer pour gérer ça au niveau du controller
@Catch(EntityNotFoundError)
export class EntityNotFoundErrorFilter implements ExceptionFilter {
  catch() {
    throw new NotFoundException();
  }
}
