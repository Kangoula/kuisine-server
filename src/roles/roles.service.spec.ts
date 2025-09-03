import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { RolesService } from './roles.service';
import { Mocked } from '@suites/doubles.jest';
import { TestBed } from '@suites/unit';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('RolesService', () => {
  let service: RolesService;
  let repository: Mocked<Repository<Role>>;

  beforeEach(async () => {
    const { unit, unitRef } = await TestBed.solitary(RolesService).compile();

    service = unit;

    repository = unitRef.get(getRepositoryToken(Role) as string);
  });

  it('should find a role by name', async () => {
    const role = new Role();
    role.id = 1;
    role.name = 'test';

    repository.findOneByOrFail.mockResolvedValue(role);

    const foundRole = await service.findByName(role.name);

    expect(repository.findOneByOrFail).toHaveBeenCalledWith({
      name: role.name,
    });
    expect(foundRole).toBeDefined();
    expect(foundRole).toEqual(expect.objectContaining(role));
  });

  it('should update a role', async () => {
    repository.update.mockResolvedValue({
      affected: 1,
      raw: [],
      generatedMaps: [],
    });

    const roleId = 1;
    const payload = {
      name: 'updated name',
    };

    const result = await service.update(roleId, payload);

    expect(repository.update).toHaveBeenCalledWith(roleId, payload);
    expect(result).toHaveProperty('affected', 1);
  });

  it('should soft delete a role', async () => {
    const roleId = 1;

    repository.softDelete.mockResolvedValue({
      affected: 1,
      raw: [],
      generatedMaps: [],
    });

    const result = await service.remove(roleId);

    expect(repository.softDelete).toHaveBeenCalledWith(roleId);
    expect(result).toHaveProperty('affected', 1);
  });
});
