import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { User } from '@/users/entities/user.entity';
import { bcryptHash } from '@/common/helpers/bcryptHash';

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

    await userFactory.save({
      username: 'Stalvester Silone',
      password,
    });

    console.log('test user created');
  }
}
