import { User } from '@/users/entities/user.entity';
import { setSeederFactory } from 'typeorm-extension';

export const UserFactory = setSeederFactory(User, (faker) => {
  const user = new User();

  user.username = faker.internet.displayName();
  user.password = faker.internet.password();

  return user;
});
