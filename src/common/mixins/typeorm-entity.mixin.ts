import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { decorate } from 'ts-mixer';

// use with ts-mixer
// MyClass extends Mixin(BaseEntity, ...otherMixins) {}

/**
 * The mixins serves as a base for all typeorm entites
 *
 * It may be inherited or composed with other mixins using ts-mixer :
 *
 * `class MyEntity extends Mixin(BaseEntity, ...otherMixins) {}`
 */
export abstract class BaseEntity {
  @decorate(PrimaryGeneratedColumn())
  id: number;
}

/**
 * Adds a deletedAt column
 */
export abstract class IsSoftDeletable {
  @decorate(DeleteDateColumn({ nullable: true }))
  @decorate(Exclude())
  deletedAt?: Date;
}

/**
 * Adds createdAt and updatedAt columns
 */
export abstract class IsTimestampable {
  @decorate(CreateDateColumn())
  createdAt: Date;

  @decorate(UpdateDateColumn())
  updatedAt: Date;
}
