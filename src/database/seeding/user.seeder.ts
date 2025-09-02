import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { User } from '@/users/entities/user.entity';
import { bcryptHash } from '@/common/helpers/bcryptHash';
import dataSource from '../data-source';
import { Role } from '@/roles/entities/role.entity';

export class UserSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    await this.createTestUser(factoryManager);
  }

  private async createTestUser(factoryManager: SeederFactoryManager) {
    console.log('creating test user...');

    const userFactory = factoryManager.get(User);

    const password = await bcryptHash('xb2212');

    const roleRepo = dataSource.manager.getRepository(Role);
    const adminRole = await roleRepo.findOneByOrFail({ isAdmin: true });
    const userRole = await roleRepo.findOneByOrFail({ name: 'User' });

    await userFactory.save({
      username: 'admin',
      password,
      roleId: adminRole.id,
    });

    await userFactory.save({
      username: 'jabba',
      password,
      roleId: userRole.id,
    });

    console.log('test user created');
  }
}
