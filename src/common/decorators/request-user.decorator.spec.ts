import { ExecutionContext } from '@nestjs/common';
import { UserWithoutCredentials } from '@/users/dto/user-without-credentials.dto';
import { requestUserFactory } from './request-user.decorator';
import { Role } from '@/roles/entities/role.entity';
import { generateOne } from '~test-utils';
import { User } from '@/users/entities/user.entity';

describe('Request User Param Decorators', () => {
  const makeContext = (user: UserWithoutCredentials | undefined) => {
    return {
      switchToHttp: () => ({
        getRequest: () => ({
          user,
        }),
      }),
    } as unknown as ExecutionContext;
  };

  it('should return the request user', () => {
    const role = generateOne(Role);
    role.id = 1;

    const expectedUser = generateOne(User, {
      role,
    });
    const result = requestUserFactory(null, makeContext(expectedUser));
    expect(result).toEqual(expect.objectContaining(expectedUser));
  });

  it('should return undefined when no user is found', () => {
    const result = requestUserFactory(null, makeContext(undefined));
    expect(result).toBeUndefined();
  });
});
