import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateIngredientToRecipeDto {
  // TODO decorator to check if exists in DB
  @IsInt()
  @IsNotEmpty()
  ingredientId: number;

  // TODO decorator to check if exists in DB
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
  quantityUnit?: string;
}
