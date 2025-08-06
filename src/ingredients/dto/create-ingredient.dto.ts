import { IsString, Length } from 'class-validator';

export class CreateIngredientDto {
  @IsString()
  @Length(1, 255)
  name: string;
}
