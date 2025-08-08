import { InjectRepository } from '@nestjs/typeorm';
import {
  DeleteResult,
  FindOptionsWhere,
  ObjectLiteral,
  Repository,
  UpdateResult,
} from 'typeorm';
import { PaginationDto } from './pagination/dto/pagination.dto';
import { Type } from '@nestjs/common';
import { SoftDeletableEntity } from './entities/soft-deletable.entity';
import { getQueryBuilderPaginationParams } from './pagination/typeorm';

type Constructor<I> = new (...args: any[]) => I;

export interface IBaseService<T extends ObjectLiteral> {
  readonly repository: Repository<T>;
  paginate(paginationDto: PaginationDto): Promise<T[]>;
  findAll(): Promise<T[]>;
  findOneOrFail(id: number): Promise<T>;
  update(id: number, partialEntity: any): Promise<UpdateResult>;
  remove(id: number): Promise<UpdateResult | DeleteResult>; // UpdateResult dans le cas d'un softDelete
}

export function BaseEntityService<T extends ObjectLiteral>(
  entity: Constructor<T>,
): Type<IBaseService<T>> {
  const isEntitySoftDeletable = new entity() instanceof SoftDeletableEntity;

  class BaseServiceHost implements IBaseService<T> {
    @InjectRepository(entity) public readonly repository: Repository<T>;

    public paginate(paginationDto: PaginationDto) {
      return this.repository.find({
        ...getQueryBuilderPaginationParams(paginationDto),
      });
    }

    public findAll() {
      return this.repository.find();
    }

    public findOneOrFail(id: number) {
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
