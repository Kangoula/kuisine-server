// test/global-setup.ts
import { config } from 'dotenv';
import { Client } from 'pg';

/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

config({ path: '.env.test', override: true });

export default async () => {
  const host = process.env.DB_HOST;
  const port = Number(process.env.DB_PORT ?? 5432);
  const user = process.env.DB_USER ?? '';
  const password = process.env.DB_PASSWORD ?? '';
  const dbName = process.env.DB_NAME;

  const admin: Client = new Client({
    host,
    port,
    user,
    password,
    database: 'postgres',
  });

  await admin.connect();

  await admin.query(`CREATE DATABASE ${dbName};`);

  await admin.end();
};
