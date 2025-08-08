import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

const typeormConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? +process.env.DB_PORT : 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  autoLoadEntities: true,
  // ajouter ici ce qu'on ne charge pas avec .forFeature
  entities: [],
  migrations: ['dist/migrations/*{.ts,.js}'],
  namingStrategy: new SnakeNamingStrategy(),
};

export default typeormConfig;
