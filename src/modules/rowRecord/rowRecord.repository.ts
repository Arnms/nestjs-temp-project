import { Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { RowRecord } from './entities/rowRecord.entity';
import { BaseRepository } from 'src/database/base/base.repository';

@Injectable()
export class RowRecordRepository extends BaseRepository<RowRecord> {
  constructor(
    @Inject('CONNECTION')
    readonly dataSource: DataSource,
  ) {
    super(dataSource.getRepository(RowRecord));
  }
}
