import { Injectable } from '@nestjs/common';
import { Seeder } from 'nestjs-seeder';
import { UsersService } from '../users.service';
import { RolesService } from '@/roles/roles.service';

@Injectable()
export class UsersSeeder implements Seeder {
  constructor(
    private readonly usersService: UsersService,
    private readonly rolesService: RolesService,
  ) {}

  async seed(): Promise<any> {
    const adminRole = await this.rolesService.getAdminRole();
    const userRole = await this.rolesService.findByName('User');

    // Insert into the database.
    return Promise.all([
      this.usersService.create({
        username: 'admin',
        password: 'xb2212',
        mustChangePassword: false,
        roleId: adminRole.id,
      }),
      this.usersService.create({
        username: 'jabba',
        password: 'xb2212',
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
