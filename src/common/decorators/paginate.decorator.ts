import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Pagination } from '../types/pagination.type';
import { Request } from 'express';

export const Paginate = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): Pagination => {
    const request: Request = ctx.switchToHttp().getRequest();

    const pagination: Pagination = {
      page: 1,
      perPage: 10,
    };

    const query: Record<string, unknown> = request.query as Record<
      string,
      unknown
    >;

    pagination.page = parseInt(String(query.page), 10) || 1;
    pagination.perPage = parseInt(String(query.perPage), 10) || 10;

    return pagination;
  },
);
