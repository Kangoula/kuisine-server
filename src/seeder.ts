import { seeder } from 'nestjs-seeder';
import { DatabaseModule } from './database/database.module';
import { UsersSeeder } from './users/user.seeder';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { ConfigModule } from './config/config.module';

seeder({
  imports: [ConfigModule, DatabaseModule, UsersModule, RolesModule],
}).run([UsersSeeder]);
