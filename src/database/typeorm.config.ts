import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SeederOptions } from 'typeorm-extension';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

const typeormConfig: TypeOrmModuleOptions & SeederOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  autoLoadEntities: true,
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/database/migrations/*{.ts,.js}'],
  migrationsRun: process.env.NODE_ENV === 'test',
  namingStrategy: new SnakeNamingStrategy(),
  seeds: ['dist/database/seeding/**/*.seeder{.ts,.js}'],
  factories: ['dist/database/seeding/factories/**/*.factory{.ts,.js}'],
};

export default typeormConfig;
