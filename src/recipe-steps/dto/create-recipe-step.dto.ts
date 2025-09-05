import { IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';

export class CreateRecipeStepDto {
  @IsInt()
  @Min(1)
  @Max(32767)
  order: number;

  @IsString()
  @IsNotEmpty()
  description: string;

  // TODO decorator to check if exists in DB
  @IsInt()
  @IsNotEmpty()
  recipeId: number;
}
