// test/setup-env.ts
import * as fs from 'fs';
import * as path from 'path';

// so jest can have access to the test db url
const p = path.join(process.cwd(), 'test', '.db-url.txt');
process.env.TEST_DB_URL = fs.readFileSync(p, 'utf-8').trim();
