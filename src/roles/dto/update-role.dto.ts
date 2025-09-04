import { IsUnique } from '@/common/decorators';
import { IsString, Length } from 'class-validator';
import { Role } from '../entities/role.entity';

export class UpdateRoleDto {
  @IsString()
  @Length(1, 255)
  @IsUnique(Role)
  name: string;
}
