import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export type EntityIdRequestParam = { params: { id: number | string } };

export const entityIdFactory = (data: unknown, ctx: ExecutionContext) => {
  const request: EntityIdRequestParam = ctx.switchToHttp().getRequest();
  const id = request.params.id;

  return +id;
};

/**
 * Parses the :id param of the request as an int
 */
export const EntityId = createParamDecorator(entityIdFactory);
