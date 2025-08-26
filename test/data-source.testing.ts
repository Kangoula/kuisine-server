import { config } from 'dotenv';
import { DataSourceOptions } from 'typeorm';

config({ path: '.env.test', override: true });

export const options = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
} as DataSourceOptions;
