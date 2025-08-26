import { hash } from 'bcrypt';

const SALT_ROUNDS = 10;

export const bcryptHash = (password: string) => {
  return hash(password, SALT_ROUNDS);
};
