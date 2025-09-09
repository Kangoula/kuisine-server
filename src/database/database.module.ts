import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { DatabaseBackupCommand } from './commands/database-backup.command';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: configService.get<string>('database.host'),
          port: configService.get<number>('database.port'),
          username: configService.get<string>('database.user'),
          password: configService.get<string>('database.password'),
          database: configService.get<string>('database.name'),
          synchronize: false,
          namingStrategy: new SnakeNamingStrategy(),
          entities: ['dist/**/*.entity{.ts,.js}'],
          autoLoadEntities: true,
        };
      },
    }),
  ],
  providers: [DatabaseBackupCommand],
  exports: [DatabaseBackupCommand],
})
export class DatabaseModule {}
