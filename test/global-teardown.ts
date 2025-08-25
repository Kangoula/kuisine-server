// test/global-teardown.ts
import { Client } from 'pg';
import { config } from 'dotenv';

/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

config({ path: '.env.test', override: true });

export default async () => {
  const dbName = process.env.DB_NAME;

  const admin = new Client({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT ?? 5432),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'postgres',
  });
  await admin.connect();

  // drop all connexions and delete db
  await admin.query(
    `
    SELECT pg_terminate_backend(pid)
    FROM pg_stat_activity
    WHERE datname = $1
  `,
    [dbName],
  );
  await admin.query(`DROP DATABASE IF EXISTS ${dbName};`);

  await admin.end();
};
