import { Injectable } from '@nestjs/common';
import { RowRecordRepository } from './rowRecord.repository';
import { RowRecord } from './entities/rowRecord.entity';
import { BaseService } from 'src/database/base/base.service';

@Injectable()
export class RowRecordService extends BaseService<RowRecord> {
  constructor(private readonly rowRecordRepository: RowRecordRepository) {
    super(rowRecordRepository);
  }
}
