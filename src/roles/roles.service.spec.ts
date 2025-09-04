import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { RolesService } from './roles.service';
import { Mocked } from '@suites/doubles.jest';
import { TestBed } from '@suites/unit';
import { getRepositoryToken } from '@nestjs/typeorm';
import { generateOne } from '~test-utils';

describe('RolesService', () => {
  let service: RolesService;
  let repository: Mocked<Repository<Role>>;

  beforeEach(async () => {
    const { unit, unitRef } = await TestBed.solitary(RolesService).compile();

    service = unit;

    repository = unitRef.get(getRepositoryToken(Role) as string);
  });

  it('should find a role by name', async () => {
    const role = generateOne(Role);
    role.id = 1;

    repository.findOneByOrFail.mockResolvedValue(role);

    const foundRole = await service.findByName(role.name);

    expect(repository.findOneByOrFail).toHaveBeenCalledWith({
      name: role.name,
    });
    expect(foundRole).toBeDefined();
    expect(foundRole).toEqual(expect.objectContaining(role));
  });

  it('should update a role', async () => {
    const roleId = 1;
    const updateData = {
      name: 'updated name',
    };

    const updatedRole = generateOne(Role, updateData);

    repository.findOneByOrFail.mockResolvedValue(updatedRole);

    const result = await service.update(roleId, updateData);

    expect(repository.findOneByOrFail).toHaveBeenCalledWith({ id: roleId });
    expect(repository.update).toHaveBeenCalledWith(roleId, updateData);
    expect(result).toHaveProperty('name', updateData.name);
  });

  it('should soft delete a role', async () => {
    const roleId = 1;

    await service.remove(roleId);

    expect(repository.softDelete).toHaveBeenCalledWith(roleId);
  });
});
