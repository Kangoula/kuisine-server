import { IsInt, IsString, Length, Max, Min } from 'class-validator';

export class CreateRecipeDto {
  @IsString()
  @Length(1, 255)
  name: string;

  @IsInt()
  @Min(1)
  @Max(65535) // unsigned small int en db
  servings: number;
}
