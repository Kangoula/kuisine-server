import { InjectRepository } from '@nestjs/typeorm';
import {
  DeleteResult,
  FindOptionsWhere,
  ObjectLiteral,
  Repository,
  UpdateResult,
} from 'typeorm';
import { PaginationDto } from './dto/pagination.dto';
import { Type } from '@nestjs/common';
import { SoftDeletableEntity } from './entities/soft-deletable.entity';

type QueryBuilderPaginationParams = {
  take: number;
  skip: number;
};

type Constructor<I> = new (...args: any[]) => I;

export interface IBaseService<T extends ObjectLiteral> {
  readonly repository: Repository<T>;
  paginate(paginationDto: PaginationDto): Promise<T[]>;
  findAll(): Promise<T[]>;
  findOneOrFail(id: number): Promise<T>;
  remove(id: number): Promise<UpdateResult | DeleteResult>;
}

export function BaseEntityService<T extends ObjectLiteral>(
  entity: Constructor<T>,
): Type<IBaseService<T>> {
  const isEntitySoftDeletable = new entity() instanceof SoftDeletableEntity;

  class BaseServiceHost implements IBaseService<T> {
    @InjectRepository(entity) public readonly repository: Repository<T>;

    private getQueryBuilderPaginationParams(
      paginationDto: PaginationDto,
    ): QueryBuilderPaginationParams {
      const page: number = paginationDto.page;

      const take: number = paginationDto.perPage;
      const skip: number = page === 1 ? 0 : take * (page - 1);

      return {
        take,
        skip,
      };
    }

    public paginate(paginationDto: PaginationDto) {
      return this.repository.find({
        ...this.getQueryBuilderPaginationParams(paginationDto),
      });
    }

    public findAll() {
      return this.repository.find();
    }

    public findOneOrFail(id: number) {
      const whereId = { id } as FindOptionsWhere<Constructor<T>>;

      return this.repository.findOneByOrFail(whereId);
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
