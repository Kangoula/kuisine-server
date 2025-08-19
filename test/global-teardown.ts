// test/global-teardown.ts
import { Client } from 'pg';
import * as fs from 'fs';
import * as path from 'path';

export default async () => {
  const urlPath = path.join(process.cwd(), 'test', '.db-url.txt');
  const url = fs.readFileSync(urlPath, 'utf-8').trim();
  const dbName = url.substring(url.lastIndexOf('/') + 1);

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
