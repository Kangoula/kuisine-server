import { User } from '../entities/user.entity';
import { Role } from '@/roles/entities/role.entity';

export class UserWithoutCredentials
  implements Omit<User, 'password' | 'refreshToken'>
{
  id: number;

  username: string;

  role: Role;
}
