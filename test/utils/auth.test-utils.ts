import { AuthService } from '@/auth/auth.service';
import { User } from '@/users/entities/user.entity';
import { UsersService } from '@/users/users.service';
import { INestApplication } from '@nestjs/common';

export const loginAs = async (app: INestApplication, username: string) => {
  const usersService = app.get(UsersService);
  const authService = app.get(AuthService);

  const user = await usersService.findByUsername(username);

  const { access_token } = authService.getAccessToken(user.id);
  return `Bearer ${access_token}`;
};

export const loginAsGivenUser = (app: INestApplication, user: User) => {
  const authService = app.get(AuthService);

  const { access_token } = authService.getAccessToken(user.id);
  return `Bearer ${access_token}`;
};
