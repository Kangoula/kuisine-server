import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

// datasource used for the migrations & seeders
const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  namingStrategy: new SnakeNamingStrategy(),
  migrations: ['dist/database/migrations/*{.ts,.js}'],
  entities: ['dist/**/*.entity{.ts,.js}'],
  seeds: ['dist/database/seeding/**/*.seeder{.ts,.js}'],
  factories: ['dist/database/seeding/factories/**/*.factory{.ts,.js}'],
} as DataSourceOptions & SeederOptions);

export default dataSource;

dataSource.initialize();
