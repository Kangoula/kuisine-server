import { DeleteDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { decorate } from 'ts-mixer';

// use with ts-mixer
// MyClass extends Mixin(BaseEntity, ...otherMixins) {}

export abstract class BaseEntity {
  @decorate(PrimaryGeneratedColumn())
  id: number;
}

export abstract class IsSoftDeletable {
  @decorate(DeleteDateColumn({ nullable: true }))
  @decorate(Exclude())
  deletedAt?: Date;
}
