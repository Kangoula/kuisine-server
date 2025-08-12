import { SoftDeletableEntity } from '@/common/entities';
import { Exclude } from 'class-transformer';
import { Column } from 'typeorm';

export class User extends SoftDeletableEntity {
  @Column('datetime')
  username: string;

  @Exclude()
  password: string;
}
