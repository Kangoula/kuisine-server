import { IsUnique } from '@/common/decorators/is-unique.decorator';
import { IsString, Length } from 'class-validator';
import { User } from '../entities/user.entity';

export class CreateUserDto {
  @IsString()
  @Length(1, 255)
  @IsUnique(User)
  username: string;

  @IsString()
  @Length(1, 255)
  password: string;
}
