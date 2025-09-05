import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { RolesModule } from '@/roles/roles.module';
import { UsersSeeder } from './entities/user.seeder';

@Module({
  imports: [TypeOrmModule.forFeature([User]), RolesModule],
  controllers: [UsersController],
  providers: [UsersService, UsersSeeder],
  exports: [UsersService, UsersSeeder],
})
export class UsersModule {}
