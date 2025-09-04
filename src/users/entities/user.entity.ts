import { BaseEntity, IsSoftDeletable, IsTimestampable } from '@/common/mixins';
import { Role } from '@/roles/entities/role.entity';
import { Exclude } from 'class-transformer';
import { Factory } from 'nestjs-seeder';
import { Mixin } from 'ts-mixer';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

export const CredentialsColumn = ['password', 'refreshToken'] as const;
export type UserCredentialsColumn = (typeof CredentialsColumn)[number];

@Entity()
export class User extends Mixin(BaseEntity, IsSoftDeletable, IsTimestampable) {
  @Factory(
    (faker, ctx: Partial<User>) =>
      ctx.username ?? faker?.internet.displayName(),
  )
  @Column({ type: 'varchar', precision: 255, unique: true })
  username: string;

  @Factory(
    (faker, ctx: Partial<User>) =>
      ctx.password ?? faker?.internet.displayName(),
  )
  @Exclude()
  @Column({ type: 'varchar', precision: 255, nullable: true, select: false })
  password?: string;

  @Factory((faker, ctx: Partial<User>) => ctx.mustChangePassword || true)
  @Exclude()
  @Column({ type: 'boolean' })
  mustChangePassword: boolean;

  @Exclude()
  @Column({ type: 'varchar', precision: 255, nullable: true, select: false })
  refreshToken?: string;

  @Factory((faker, ctx: Partial<User>) => ctx.roleId || ctx.role?.id)
  @Column({ type: 'int' })
  roleId: number;

  @Factory((faker, ctx: Partial<User>) => ctx.role)
  @ManyToOne(() => Role, (role) => role.users)
  @JoinColumn({ name: 'role_id' })
  role: Role;
}
