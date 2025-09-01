import { Column, Entity, OneToMany } from 'typeorm';
import { SoftDeletableEntity } from '@/common/entities/soft-deletable.entity';
import { User } from '@/users/entities/user.entity';
import { MongoQuery, RawRule } from '@casl/ability';
import { Action } from '@/casl/action.enum';
import { Exclude } from 'class-transformer';

export interface Conditions extends MongoQuery {
  isOwner?: boolean;
  isMe?: boolean;
}

export interface Permission extends RawRule {
  action: Action | Action[] | string | string[];
  conditions?: Conditions;
}

@Entity()
export class Role extends SoftDeletableEntity {
  @Column({ type: 'varchar', precision: 255, unique: true })
  name: string;

  @Exclude()
  @Column({ type: 'boolean', update: false })
  isAdmin: boolean;

  @Exclude()
  @Column({ type: 'simple-json', nullable: true })
  permissions?: Permission[];

  @OneToMany(() => User, (user) => user.role, {
    cascade: true,
  })
  users: User[];
}
