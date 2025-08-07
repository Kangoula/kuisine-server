import { CreateIngredientToRecipeDto } from './create-ingredient-to-recipe.dto';
import { PickType } from '@nestjs/mapped-types';

export class UpdateIngredientToRecipeDto extends PickType(
  CreateIngredientToRecipeDto,
  ['order', 'quantity', 'quantityUnit'],
) {}
