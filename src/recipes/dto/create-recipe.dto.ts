import { IsInt, IsString, Length, Max, Min } from 'class-validator';

export class CreateRecipeDto {
  @IsString()
  @Length(1, 255)
  name: string;

  @IsInt()
  @Min(1)
  @Max(32767)
  servings: number;

  @IsInt()
  @Min(1)
  @Max(32767)
  cookingDurationMinutes: number;

  @IsInt()
  @Min(1)
  @Max(32767)
  preparationDurationMinutes: number;
}
