import { IsNumber, IsOptional, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(1, 255)
  username: string;

  @IsString()
  @Length(1, 255)
  password: string;

  @IsNumber()
  @IsOptional()
  roleId?: number;
}
