import { PartialType } from '@nestjs/mapped-types';
import { CreateRecipeStepDto } from './create-recipe_step.dto';

export class UpdateRecipeStepDto extends PartialType(CreateRecipeStepDto) {}
