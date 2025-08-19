import { SoftDeletableEntity } from '@/common/entities';
import { Exclude } from 'class-transformer';
import { Column, Entity } from 'typeorm';

@Entity()
export class User extends SoftDeletableEntity {
  @Column({ type: 'varchar', precision: 255 })
  username: string;

  @Exclude()
  @Column({ type: 'varchar', precision: 255 })
  password: string;
}
