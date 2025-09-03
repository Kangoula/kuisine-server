import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TestBed } from '@suites/unit';
import { Mocked } from '@suites/doubles.jest';
import { Role } from '@/roles/entities/role.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let service: Mocked<UsersService>;

  beforeEach(async () => {
    const { unit, unitRef } = await TestBed.solitary(UsersController).compile();

    controller = unit;
    service = unitRef.get<UsersService>(UsersService);
  });

  it('should return a list of users', async () => {
    const users = [
      {
        id: 1,
        username: 'Seaven Stegal',
        password: 'MielEnHautePierre',
        roleId: 1,
        role: new Role(),
      },
      {
        id: 2,
        username: 'Nuck Chorris',
        password: 'TalkerRexasWanger',
        roleId: 1,
        role: new Role(),
      },
    ];

    service.paginate.mockResolvedValue(users);

    const returnedUsers = await controller.findAll({ page: 1, perPage: 10 });

    expect(service.paginate).toHaveBeenCalledWith({ page: 1, perPage: 10 });
    expect(returnedUsers).toBe(users);
  });

  it('should return the requested user', async () => {
    const userId = 1;
    const user = {
      id: userId,
      username: 'Schwold Arnarzenegger',
      password: 'MonsieurGelDansChauveSourisHomme',
      roleId: 1,
      role: new Role(),
    };

    service.findOne.mockResolvedValue(user);

    const returnedUser = await controller.findOne(userId);

    expect(service.findOne).toHaveBeenCalledWith(userId);
    expect(returnedUser).toBe(user);
  });

  it('should reject when the requested user does not exists', () => {
    const userId = 1;
    const err = new Error('not found');

    service.findOne.mockImplementation(() => {
      return Promise.reject(err);
    });

    //eslint-disable-next-line @typescript-eslint/no-floating-promises
    expect(controller.findOne(userId)).rejects.toBe(err);
  });

  it('should update user', async () => {
    const user = {
      id: 1,
      username: 'Schwold Arnarzenegger',
      password: 'MonsieurGelDansChauveSourisHomme',
    };
    const updateData = { username: 'Clorge Geooney' };

    service.update.mockResolvedValue({
      affected: 1,
      raw: [],
      generatedMaps: [],
    });

    const result = await controller.update(user.id, updateData);

    expect(service.update).toHaveBeenCalledWith(user.id, updateData);
    expect(result.affected).toBe(1);
  });

  it('should reject when the user to update does not exists', () => {
    const userId = 1;
    const updateData = { username: 'Clorge Geooney' };
    const err = new Error('not found');

    service.update.mockImplementation(() => {
      return Promise.reject(err);
    });

    //eslint-disable-next-line @typescript-eslint/no-floating-promises
    expect(controller.update(userId, updateData)).rejects.toBe(err);
  });

  it('should delete user', async () => {
    const userId = 1;

    service.remove.mockResolvedValue({
      affected: 1,
      raw: [],
    });

    const result = await controller.remove(userId);

    expect(service.remove).toHaveBeenCalledWith(userId);
    expect(result.affected).toBe(1);
  });

  it('should reject when user to delete does not exists', async () => {
    const userId = 1;
    const err = new Error('not found');

    service.remove.mockImplementation(() => {
      return Promise.reject(err);
    });

    //eslint-disable-next-line @typescript-eslint/no-floating-promises
    expect(controller.remove(userId)).rejects.toBe(err);
  });
});
