import { DataSource, DataSourceOptions } from 'typeorm';
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
} as DataSourceOptions);

dataSource.initialize();

export default dataSource;
