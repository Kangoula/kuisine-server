import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TestBed } from '@suites/unit';
import { Mocked } from '@suites/doubles.jest';
import { User } from './entities/user.entity';
import { generateMany, generateOne } from '~test-utils';

describe('UsersController', () => {
  let controller: UsersController;
  let service: Mocked<UsersService>;

  beforeEach(async () => {
    const { unit, unitRef } = await TestBed.solitary(UsersController).compile();

    controller = unit;
    service = unitRef.get<UsersService>(UsersService);
  });

  it('should return a list of users', async () => {
    const users = generateMany(User, 2);

    service.paginate.mockResolvedValue(users);

    const returnedUsers = await controller.findAll({ page: 1, perPage: 10 });

    expect(service.paginate).toHaveBeenCalledWith({ page: 1, perPage: 10 });
    expect(returnedUsers).toBe(users);
  });

  it('should return the requested user', async () => {
    const userId = 1;

    const user = generateOne(User, {
      username: 'Schwold Arnarzenegger',
    });
    user.id = userId;
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
    const updateData = { username: 'Clorge Geooney' };

    const user = generateOne(User);
    user.id = 1;

    service.update.mockResolvedValue({
      ...user,
      ...updateData,
    });

    const result = await controller.update(user.id, updateData);

    expect(service.update).toHaveBeenCalledWith(user.id, updateData);
    expect(result).toHaveProperty('username', updateData.username);
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

    const result = await controller.remove(userId);

    expect(service.remove).toHaveBeenCalledWith(userId);
    expect(result).toBeUndefined();
  });

  it('should reject when user to delete does not exists', () => {
    const userId = 1;
    const err = new Error('not found');

    service.remove.mockImplementation(() => {
      return Promise.reject(err);
    });

    //eslint-disable-next-line @typescript-eslint/no-floating-promises
    expect(controller.remove(userId)).rejects.toBe(err);
  });
});
