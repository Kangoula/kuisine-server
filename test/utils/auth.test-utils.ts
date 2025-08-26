import { AuthService } from '@/auth/auth.service';
import { UsersService } from '@/users/users.service';
import { INestApplication } from '@nestjs/common';

export const loginAs = async (app: INestApplication, username: string) => {
  const usersService = app.get(UsersService);
  const authService = app.get(AuthService);

  const user = await usersService.findOneBy({ username });

  const { access_token } = authService.login(user);
  return `Bearer ${access_token}`;
};
