import { ConfigService } from '@nestjs/config';
import { execSync } from 'child_process';
import { writeFile, chmod, chown } from 'fs/promises';
import { Command, CommandRunner } from 'nest-commander';
import { resolve } from 'path';

@Command({
  name: 'db:backup',
  description: 'Performs a full database dump',
})
export class DatabaseBackupCommand extends CommandRunner {
  constructor(private readonly configService: ConfigService) {
    super();
  }

  async run(): Promise<void> {
    console.log('Database backup started');
    console.time('Database backup');

    const { host, port, user, password, name } = this.configService.get(
      'database',
    ) as {
      host: string;
      port: number;
      user: string;
      password: string;
      name: string;
    };

    const pgPassFilePath = await this.createPgPassFile(
      host,
      port,
      user,
      password,
      name,
    );

    const dumpFileName = 'dump.sql';
    const dumpPath = resolve('/tmp', dumpFileName);

    execSync(
      `PGPASSFILE='${pgPassFilePath}' && pg_dump -d ${name} -h ${host} -U ${user} -w > ${dumpPath}`,
    );

    console.timeEnd('Database backup');
    console.log('Database backup done');
  }

  private async createPgPassFile(
    host: string,
    port: number,
    user: string,
    password: string,
    name: string,
  ) {
    const pgPassFileName = '.pgpass';
    const pgPassFilePath = resolve('/tmp', pgPassFileName);

    const pgPassContent = `${host}:${port}:${name}:${user}:${password}`;

    await writeFile(pgPassFilePath, pgPassContent);

    await chmod(pgPassFilePath, '600');
    await chown(pgPassFilePath, 1000, 1000);

    return pgPassFilePath;
  }
}
