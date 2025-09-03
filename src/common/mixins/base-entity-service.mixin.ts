import { InjectRepository } from '@nestjs/typeorm';
import {
  DeleteResult,
  FindOptionsWhere,
  ObjectLiteral,
  Repository,
  UpdateResult,
} from 'typeorm';
import { Type } from '@nestjs/common';
import { PaginationDto } from '../pagination';
import { getQueryBuilderPaginationParams } from '../pagination/typeorm';
import { TypedConstructor } from '../types';
import { hasMixin } from 'ts-mixer';
import { IsSoftDeletable } from './typeorm-entity.mixin';

export interface IBaseService<T extends ObjectLiteral> {
  readonly repository: Repository<T>;
  paginate(paginationDto: PaginationDto): Promise<T[]>;
  findAll(): Promise<T[]>;
  findOne(id: number): Promise<T>;
  update(id: number, partialEntity: any): Promise<UpdateResult>;
  remove(id: number): Promise<DeleteResult>;
}

export function BaseEntityService<T extends ObjectLiteral>(
  entity: TypedConstructor<T>,
): Type<IBaseService<T>> {
  class BaseServiceHost implements IBaseService<T> {
    @InjectRepository(entity)
    public readonly repository: Repository<T>;

    public paginate(paginationDto: PaginationDto) {
      return this.repository.find({
        ...getQueryBuilderPaginationParams(paginationDto),
      });
    }

    public findAll() {
      return this.repository.find();
    }

    public findOne(id: number) {
      const whereId = { id } as FindOptionsWhere<TypedConstructor<T>>;

      return this.repository.findOneByOrFail(whereId);
    }

    public update(id: number, partialEntity: Partial<T>) {
      return this.repository.update(id, partialEntity);
    }

    public remove(id: number) {
      return this.repository.delete(id);
    }
  }

  // service without soft delete
  if (!hasMixin(new entity(), IsSoftDeletable)) {
    return BaseServiceHost;
  }

  // service with soft delete
  return class extends BaseServiceHost {
    public remove(id: number) {
      return this.repository.softDelete(id);
    }
  };
}
