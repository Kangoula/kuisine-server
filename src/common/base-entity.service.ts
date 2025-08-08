import { InjectRepository } from '@nestjs/typeorm';
import {
  FindOptionsWhere,
  ObjectLiteral,
  Repository,
  UpdateResult,
} from 'typeorm';
import { PaginationDto } from './dto/pagination.dto';
import { Type } from '@nestjs/common';
import { SoftDeletableEntity } from './entities/soft-deletable.entity';
import { BaseEntity } from './entities/base.entity';

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
}

export function BaseEntityService<T extends ObjectLiteral>(
  entity: Constructor<T>,
): Type<IBaseService<T>> {
  class BaseServiceHost implements IBaseService<T> {
    @InjectRepository(entity) public readonly repository: Repository<T>;

    public paginate(paginationDto: PaginationDto) {
      console.log(new entity() instanceof SoftDeletableEntity);
      return this.repository.find({
        ...this.getQueryBuilderPaginationParams(paginationDto),
      });
    }

    findAll() {
      return this.repository.find();
    }

    findOneOrFail(id: number) {
      const whereId = { id } as FindOptionsWhere<Constructor<T>>;

      return this.repository.findOneByOrFail(whereId);
    }

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
  }

  return BaseServiceHost;
}
