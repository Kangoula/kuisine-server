import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserWithoutCredentials } from '@/users/dto/user-without-credentials.dto';

export type ReqWithUser = { user: UserWithoutCredentials };

export const requestUserFactory = (data: unknown, ctx: ExecutionContext) => {
  const request: ReqWithUser = ctx.switchToHttp().getRequest();

  return request.user;
};

/**
 * Returns the authenticated user of the request
 */
export const RequestUser = createParamDecorator(requestUserFactory);
