import { User } from '@/users/entities/user.entity';

export type Constructor<I> = new (...args: any[]) => I;

export type ReqWithUser = { user: User };
