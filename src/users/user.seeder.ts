import { Injectable } from '@nestjs/common';
import { Seeder } from 'nestjs-seeder';
import { UsersService } from './users.service';
import { RolesService } from '@/roles/roles.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersSeeder implements Seeder {
  constructor(
    private readonly usersService: UsersService,
    private readonly rolesService: RolesService,
    private readonly configService: ConfigService,
  ) {}

  async seed(): Promise<any> {
    if (this.configService.get('NODE_ENV') === 'production') {
      console.error('Users seeding is unavailable in production mode');
      return;
    }

    const adminRole = await this.rolesService.getAdminRole();
    const userRole = await this.rolesService.findByName('User');

    // Insert into the database.
    await Promise.all([
      this.usersService.create({
        username: 'admin',
        password: this.configService.get<string>(
          'TEST_USER_PASSWORD',
        ) as string,
        mustChangePassword: false,
        roleId: adminRole.id,
      }),
      this.usersService.create({
        username: 'jabba',
        password: this.configService.get<string>(
          'TEST_USER_PASSWORD',
        ) as string,
        mustChangePassword: false,
        roleId: userRole.id,
      }),
    ]);
  }

  async drop(): Promise<any> {
    const admin = await this.usersService.findByUsername('admin');
    const user = await this.usersService.findByUsername('jabba');
    return this.usersService.repository.remove([admin, user]);
  }
}
