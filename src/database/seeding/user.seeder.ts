import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { User } from '@/users/entities/user.entity';
import { bcryptHash } from '@/common/helpers/bcryptHash';
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

    const role = new Role();
    role.id = 1;

    await userFactory.save({
      username: 'admin',
      password,
      role,
    });

    console.log('test user created');
  }
}
