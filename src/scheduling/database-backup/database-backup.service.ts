import { DatabaseBackupCommand } from '@/database/commands/database-backup.command';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class DatabaseBackupService {
  private readonly logger = new Logger(DatabaseBackupService.name, {
    timestamp: true,
  });

  constructor(private readonly databaseBackupCommand: DatabaseBackupCommand) {}

  @Cron(CronExpression.EVERY_DAY_AT_6AM, { waitForCompletion: true })
  async runDatabaseBackup() {
    try {
      this.logger.log('Database backup started');
      await this.databaseBackupCommand.run();
      this.logger.log('Database backup done');
    } catch (error) {
      this.logger.error('Cron job for database backup failed', error);
    }
  }
}
