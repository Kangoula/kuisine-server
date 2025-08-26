import { AuthService } from '@/auth/auth.service';
import { UsersService } from '@/users/users.service';
import { INestApplication } from '@nestjs/common';

/**
 * For e2e tests
 *
 * returns the access token to put in the Authorization header
 */
export const getRealUserBearerToken = async (
  app: INestApplication,
): Promise<string> => {
  const user = {
    username: 'user test',
    password: 'test',
  };

  const usersService = app.get(UsersService);
  const authService = app.get(AuthService);

  const u = await usersService.create(user);
  const { access_token } = authService.login(u);

  return `Bearer ${access_token}`;
};
