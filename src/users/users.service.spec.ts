import { UsersService } from './users.service';
import { TestBed } from '@suites/unit';
import { Mocked } from '@suites/doubles.jest';
import { UsersRepository } from './users.repository';
import { hash } from 'bcrypt';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Mocked<UsersRepository>;

  beforeEach(async () => {
    const { unit, unitRef } = await TestBed.solitary(UsersService).compile();

    service = unit;
    repository = unitRef.get<UsersRepository>(UsersRepository);
  });

  it('should hash password on creation', async () => {
    const username = 'Lucien Marcheciel';
    const password = 'LeChictabaDansLeMilleniumCondor';

    repository.save.mockResolvedValue({
      id: 1,
      username,
      password: await hash(password, 10),
    });

    const userToCreate = {
      username,
      password,
    };

    const createdUser = await service.create(userToCreate);

    expect(repository.save).toHaveBeenCalled();
    expect(createdUser.password).toBeDefined();
    expect(createdUser.password).not.toBe(password);
  });

  it('should soft delete user', async () => {
    const userId = 1;

    await service.remove(userId);

    expect(repository.softDelete).toHaveBeenCalledWith(userId);
  });

  it('should return true when passwords are the same', async () => {
    const userId = 1;
    const password = 'LeChictabaDansLeMilleniumCondor';

    repository.findOneOrFail.mockResolvedValue({
      id: userId,
      username: 'user',
      password: await hash(password, 10),
    });

    const result = await service.comparePasswordWithStoredHash(
      userId,
      password,
    );

    expect(repository.findOneOrFail).toHaveBeenCalled();
    expect(result).toBe(true);
  });

  it('should return false when passwords are different', async () => {
    const userId = 1;
    const wrongPassword = 'JabbaLeForestierEmbaucheZ6PO';

    repository.findOneOrFail.mockResolvedValue({
      id: userId,
      username: 'user',
      password: await hash('LeChictabaDansLeMilleniumCondor', 10),
    });

    const result = await service.comparePasswordWithStoredHash(
      userId,
      wrongPassword,
    );

    expect(repository.findOneOrFail).toHaveBeenCalled();
    expect(result).toBe(false);
  });
});
