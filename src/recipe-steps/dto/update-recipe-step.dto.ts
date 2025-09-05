import { PickType } from '@nestjs/mapped-types';
import { CreateRecipeStepDto } from './create-recipe-step.dto';

export class UpdateRecipeStepDto extends PickType(CreateRecipeStepDto, [
  'order',
  'description',
]) {}
