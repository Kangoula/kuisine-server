import { Module } from '@nestjs/common';
import { DatabaseBackupService } from './database-backup/database-backup.service';
import { DatabaseModule } from '@/database/database.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ScheduleModule.forRoot(), DatabaseModule],
  providers: [DatabaseBackupService],
})
export class SchedulingModule {}
