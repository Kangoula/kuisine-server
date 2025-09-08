import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { QuantityUnits } from '../entities/ingredient-to-recipe.entity';

export class CreateIngredientToRecipeDto {
  @IsInt()
  @IsNotEmpty()
  ingredientId: number;

  @IsInt()
  @IsNotEmpty()
  recipeId: number;

  @IsInt()
  @Min(1)
  @Max(32767)
  order: number;

  @IsInt()
  @Min(1)
  @Max(32767)
  quantity: number;

  @IsOptional()
  @IsString()
  @IsEnum(QuantityUnits)
  quantityUnit?: QuantityUnits | null;
}
