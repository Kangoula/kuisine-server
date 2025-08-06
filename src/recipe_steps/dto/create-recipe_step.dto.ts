import { IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';

export class CreateRecipeStepDto {
  @IsInt()
  @Min(1)
  @Max(65535) // unsigned small int en db
  order: number;

  @IsString()
  @IsNotEmpty()
  description: string;
}
