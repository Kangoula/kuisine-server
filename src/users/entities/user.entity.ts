import { SoftDeletableEntity } from '@/common/entities';
import { Exclude } from 'class-transformer';
import { Column, Entity } from 'typeorm';

@Entity()
export class User extends SoftDeletableEntity {
  @Column({ type: 'varchar', precision: 255, unique: true })
  username: string;

  @Exclude()
  @Column({ type: 'varchar', precision: 255, select: false })
  password: string;

  @Exclude()
  @Column({ type: 'varchar', precision: 255, nullable: true })
  refreshToken?: string;
}
