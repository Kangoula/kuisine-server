import { IsNumber, IsString, Length } from 'class-validator';

export class UserWithoutCredentials {
  @IsNumber()
  id: number;

  @IsString()
  @Length(1, 255)
  username: string;
}
