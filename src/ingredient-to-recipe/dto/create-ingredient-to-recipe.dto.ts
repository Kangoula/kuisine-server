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
  @Max(65535) // unsigned small int en db
  order: number;

  @IsInt()
  @Min(1)
  @Max(65535) // unsigned small int en db
  quantity: number;

  @IsOptional()
  @IsString()
  quantityUnit?: string;
}
