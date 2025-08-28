import { Column, Entity, OneToMany } from 'typeorm';
import { SoftDeletableEntity } from '@/common/entities/soft-deletable.entity';
import { User } from '@/users/entities/user.entity';

export interface Permission {
  subject: string;
  action: string;
  conditions?: any;
}

@Entity()
export class Role extends SoftDeletableEntity {
  @Column({ type: 'varchar', precision: 255, unique: true })
  name: string;

  @Column({ type: 'simple-json', nullable: true })
  permissions?: Permission[];

  @OneToMany(() => User, (user) => user.role, {
    cascade: true,
  })
  users: User[];
}
