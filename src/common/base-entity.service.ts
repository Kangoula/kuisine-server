import { InjectRepository } from '@nestjs/typeorm';
import {
  DeleteResult,
  FindOptionsWhere,
  ObjectLiteral,
  Repository,
  UpdateResult,
} from 'typeorm';
import { Type } from '@nestjs/common';
import { PaginationDto } from './pagination';
import { SoftDeletableEntity } from './entities';
import { getQueryBuilderPaginationParams } from './pagination/typeorm';
import { Constructor } from './types';

export interface IBaseService<T extends ObjectLiteral> {
  readonly repository: Repository<T>;
  paginate(paginationDto: PaginationDto): Promise<T[]>;
  findAll(): Promise<T[]>;
  findOne(id: number): Promise<T>;
  update(id: number, partialEntity: any): Promise<UpdateResult>;
  insert(entity: T): Promise<T>;
  remove(id: number): Promise<UpdateResult | DeleteResult>; // we receive UpdateResult when entity is soft deleted
}

export function BaseEntityService<T extends ObjectLiteral>(
  entity: Constructor<T>,
): Type<IBaseService<T>> {
  const isEntitySoftDeletable = entity.prototype instanceof SoftDeletableEntity;

  class BaseServiceHost implements IBaseService<T> {
    @InjectRepository(entity)
    public readonly repository: Repository<T>;

    public async insert(entity: T) {
      await this.repository.insert(entity);
      return entity;
    }

    public paginate(paginationDto: PaginationDto) {
      return this.repository.find({
        ...getQueryBuilderPaginationParams(paginationDto),
      });
    }

    public findAll() {
      return this.repository.find();
    }

    public findOne(id: number) {
      const whereId = { id } as FindOptionsWhere<Constructor<T>>;

      return this.repository.findOneByOrFail(whereId);
    }

    public update(id: number, partialEntity: Partial<T>) {
      return this.repository.update(id, partialEntity);
    }

    public remove(id: number) {
      if (isEntitySoftDeletable) {
        return this.repository.softDelete(id);
      }

      return this.repository.delete(id);
    }
  }

  return BaseServiceHost;
}
