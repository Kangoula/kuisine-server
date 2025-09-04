import { Column, Entity, OneToMany } from 'typeorm';
import { User } from '@/users/entities/user.entity';
import { MongoQuery, RawRule } from '@casl/ability';
import { Action } from '@/casl/action.enum';
import { Exclude } from 'class-transformer';
import { Mixin } from 'ts-mixer';
import { BaseEntity, IsSoftDeletable, IsTimestampable } from '@/common/mixins';
import { Factory } from 'nestjs-seeder';

export interface Conditions extends MongoQuery {
  isOwner?: boolean;
  isMe?: boolean;
}

export interface Permission extends RawRule {
  action: Action | Action[] | string | string[];
  conditions?: Conditions;
}

@Entity()
export class Role extends Mixin(BaseEntity, IsSoftDeletable, IsTimestampable) {
  @Factory((faker, ctx: Partial<Role>) => ctx.name ?? faker?.lorem.word())
  @Column({ type: 'varchar', precision: 255, unique: true })
  name: string;

  @Factory((faker, ctx: Partial<Role>) => ctx.isAdmin ?? false)
  @Exclude()
  @Column({ type: 'boolean', update: false })
  isAdmin: boolean;

  @Factory((faker, ctx: Partial<Role>) => ctx.permissions ?? [])
  @Exclude()
  @Column({ type: 'simple-json', nullable: true })
  permissions?: Permission[];

  @OneToMany(() => User, (user) => user.role, {
    cascade: true,
  })
  users: User[];
}
