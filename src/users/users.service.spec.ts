import { UsersService } from './users.service';
import { TestBed } from '@suites/unit';
import { Mocked } from '@suites/doubles.jest';
import { hash } from 'bcrypt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Mocked<Repository<User>>;

  beforeEach(async () => {
    const { unit, unitRef } = await TestBed.solitary(UsersService).compile();

    service = unit;

    repository = unitRef.get(getRepositoryToken(User) as string);
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
});
