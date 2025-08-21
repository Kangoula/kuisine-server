import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TestBed } from '@suites/unit';
import { Mocked } from '@suites/doubles.jest';

describe('UsersController', () => {
  let controller: UsersController;
  let service: Mocked<UsersService>;

  beforeEach(async () => {
    const { unit, unitRef } = await TestBed.solitary(UsersController).compile();

    controller = unit;
    service = unitRef.get<UsersService>(UsersService);
  });

  it('should create the given user', async () => {
    const userData = {
      username: 'Seaven Stegal',
      password: 'MielEnHautePierre',
    };

    const expectedUser = {
      id: 1,
      username: 'Seaven Stegal',
      password: 'MielEnHautePierre',
    };

    service.create.mockResolvedValue(expectedUser);

    const createdUser = await controller.create(userData);

    expect(service.create).toHaveBeenCalledWith(userData);
    expect(createdUser).toBe(expectedUser);
  });

  it('should return a list of users', async () => {
    const users = [
      { id: 1, username: 'Seaven Stegal', password: 'MielEnHautePierre' },
      { id: 2, username: 'Nuck Chorris', password: 'TalkerRexasWanger' },
    ];

    service.paginate.mockResolvedValue(users);

    const returnedUsers = await controller.findAll({ page: 1, perPage: 10 });

    expect(service.paginate).toHaveBeenCalledWith({ page: 1, perPage: 10 });
    expect(returnedUsers).toBe(users);
  });
});
