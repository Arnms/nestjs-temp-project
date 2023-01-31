import { Module } from '@nestjs/common';
import { RowRecordService } from './rowRecord.service';
import { DatabaseModule } from 'src/database/database.module';
import { RowRecordRepository } from './rowRecord.repository';

@Module({
  imports: [DatabaseModule],
  providers: [RowRecordService, RowRecordRepository],
  exports: [RowRecordService],
})
export class RowRecordModule {}
