import { BaseEntity, IsSoftDeletable } from '@/common/mixins';
import { Role } from '@/roles/entities/role.entity';
import { Exclude } from 'class-transformer';
import { Mixin } from 'ts-mixer';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

export const CredentialsColumn = ['password', 'refreshToken'] as const;
export type UserCredentialsColumn = (typeof CredentialsColumn)[number];

@Entity()
export class User extends Mixin(BaseEntity, IsSoftDeletable) {
  @Column({ type: 'varchar', precision: 255, unique: true })
  username: string;

  @Exclude()
  @Column({ type: 'varchar', precision: 255, nullable: true, select: false })
  password?: string;

  @Exclude()
  @Column({ type: 'varchar', precision: 255, nullable: true, select: false })
  refreshToken?: string;

  @Column({ type: 'int' })
  roleId: number;

  @ManyToOne(() => Role, (role) => role.users)
  @JoinColumn({ name: 'role_id' })
  role: Role;
}
