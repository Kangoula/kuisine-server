import { IsUnique } from '@/common/decorators';
import { IsNumber, IsOptional, IsString, Length } from 'class-validator';
import { User } from '../entities/user.entity';

export class CreateUserDto {
  @IsString()
  @Length(1, 255)
  @IsUnique(User)
  username: string;

  @IsString()
  @Length(1, 255)
  password: string;

  @IsNumber()
  @IsOptional()
  roleId?: number;
}
