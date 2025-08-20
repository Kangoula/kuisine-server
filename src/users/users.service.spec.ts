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
    const password = 'LeChiqueTabacDansLeMilleniumCondor';

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
});
