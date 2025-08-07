import { DeleteDateColumn } from "typeorm";
import { BaseEntity } from "./base.entity";

export abstract class SoftDeletableEntity extends BaseEntity {
  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;
}