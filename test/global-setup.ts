// test/global-setup.ts
import { Client } from 'pg';
import * as fs from 'fs';
import * as path from 'path';
import { config } from 'dotenv';

config({ path: '.env.test' });

const host = process.env.DB_HOST;
const port = Number(process.env.DB_PORT ?? 5432);
const user = process.env.DB_USER ?? '';
const password = process.env.DB_PASSWORD ?? '';

export default async () => {
  const admin = new Client({
    host: 'localhost',
    port,
    user,
    password,
    database: 'postgres',
  });
  await admin.connect();

  const dbName = `app_test_${Date.now()}`;
  await admin.query(`CREATE DATABASE ${dbName};`);

  const url = `postgres://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${host}:${port}/${dbName}`;
  const out = path.join(process.cwd(), 'test', '.db-url.txt');
  fs.writeFileSync(out, url, 'utf-8');

  await admin.end();
};
