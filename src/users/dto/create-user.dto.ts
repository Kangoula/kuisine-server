import { IsUnique } from '@/common/decorators';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { User } from '../entities/user.entity';

export class CreateUserDto {
  @IsString()
  @Length(1, 255)
  @IsUnique(User)
  username: string;

  @IsString()
  @Length(1, 255)
  password: string;

  @IsBoolean()
  @IsOptional()
  mustChangePassword?: boolean;

  @IsNumber()
  @IsOptional()
  roleId?: number;
}
