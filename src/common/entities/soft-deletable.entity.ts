import { DeleteDateColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Exclude } from 'class-transformer';

export abstract class SoftDeletableEntity extends BaseEntity {
  @DeleteDateColumn({ nullable: true })
  @Exclude()
  deletedAt?: Date;
}
