import { AuthService } from './auth.service';
import { TestBed } from '@suites/unit';
import { UsersService } from '@/users/users.service';
import { Mocked } from '@suites/doubles.jest';
import { bcryptHash } from '@/common/helpers/bcryptHash';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PostgresErrorCode } from '@/database/postgresErrorCodes.enum';

describe('AuthService', () => {
  let service: AuthService;
  let usersSerivce: Mocked<UsersService>;

  beforeEach(async () => {
    const { unit, unitRef } = await TestBed.solitary(AuthService).compile();

    service = unit;

    usersSerivce = unitRef.get(UsersService);
  });

  it('should return true when passwords are the same', async () => {
    const userId = 1;
    const username = 'user';
    const password = 'LeChictabaDansLeMilleniumCondor';

    usersSerivce.findByUsernameWithPassword.mockResolvedValue({
      id: userId,
      username,
      password: await bcryptHash(password),
    });

    const result = await service.validateUser(username, password);

    expect(usersSerivce.findByUsernameWithPassword).toHaveBeenCalled();
    expect(result).toBeTruthy();
    expect(result?.username).toBe(username);
    expect(result?.id).toBe(userId);
  });

  it('should return false when passwords are different', async () => {
    const userId = 1;
    const username = 'user';
    const wrongPassword = 'JabbaLeForestierEmbaucheZ6PO';

    usersSerivce.findByUsernameWithPassword.mockResolvedValue({
      id: userId,
      username,
      password: await bcryptHash('LeChictabaDansLeMilleniumCondor'),
    });

    await expect(service.validateUser(username, wrongPassword)).rejects.toThrow(
      new BadRequestException('Wrong credentials provided'),
    );

    expect(usersSerivce.findByUsernameWithPassword).toHaveBeenCalled();
  });

  it('should register a new user', async () => {
    const expectedUserId = 1;
    const username = 'Nuck Chorris';
    const password = 'pw';

    usersSerivce.create.mockResolvedValue({
      id: expectedUserId,
      username,
    });

    const result = await service.register({ username, password });

    expect(result).toBeTruthy();
    expect(result.username).toBe(username);
    expect(result.id).toBe(expectedUserId);

    expect(usersSerivce.create).toHaveBeenCalledWith(
      expect.objectContaining({
        username,
        password,
      }),
    );
  });

  it('register should throw BadRequest if username already exists', async () => {
    const username = 'Nuck Chorris';
    const password = 'pw';

    usersSerivce.create.mockRejectedValue({
      code: PostgresErrorCode.UniqueViolation,
    });

    await expect(service.register({ username, password })).rejects.toThrow(
      new BadRequestException('A User with this username already exists'),
    );

    expect(usersSerivce.create).toHaveBeenCalledWith(
      expect.objectContaining({
        username,
        password,
      }),
    );
  });

  it('register should throw InternalServerError', async () => {
    const username = 'Nuck Chorris';
    const password = 'pw';

    usersSerivce.create.mockRejectedValue(
      'error that is not a postgres unique violation error',
    );

    await expect(service.register({ username, password })).rejects.toThrow(
      new InternalServerErrorException(),
    );

    expect(usersSerivce.create).toHaveBeenCalledWith(
      expect.objectContaining({
        username,
        password,
      }),
    );
  });
});
