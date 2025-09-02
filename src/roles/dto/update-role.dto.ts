import { IsString, Length } from 'class-validator';

export class UpdateRoleDto {
  @IsString()
  @Length(1, 255)
  name: string;
}
