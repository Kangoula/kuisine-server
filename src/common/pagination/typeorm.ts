import { PaginationDto } from './dto/pagination.dto';

type QueryBuilderPaginationParams = {
  take: number;
  skip: number;
};

export const getQueryBuilderPaginationParams = (
  paginationDto: PaginationDto,
): QueryBuilderPaginationParams => {
  const page: number = paginationDto.page;

  const take: number = paginationDto.perPage;
  const skip: number = page === 1 ? 0 : take * (page - 1);

  return {
    take,
    skip,
  };
};
