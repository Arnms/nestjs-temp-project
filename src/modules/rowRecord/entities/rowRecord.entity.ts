import { IsNotEmpty } from 'class-validator';
import { Base } from 'src/database/base/base.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { QueryAction } from '../interfaces/rowRecord.enum';

@Entity({ name: 'row_record' })
export class RowRecord extends Base {
  @PrimaryGeneratedColumn('increment', { type: 'int', name: 'id' })
  id: number;

  @IsNotEmpty()
  @Column('varchar', { nullable: false, name: 'target_table', length: 100 })
  targetTable: string;

  @IsNotEmpty()
  @Column('varchar', { nullable: false, name: 'target_id', length: 100 })
  targetId: string;

  @IsNotEmpty()
  @Column('enum', {
    nullable: false,
    enum: QueryAction,
    name: 'action',
  })
  action: QueryAction;

  @IsNotEmpty()
  @Column('varchar', { nullable: false, name: 'user_id', length: 100 })
  userId: string;

  @IsNotEmpty()
  @CreateDateColumn({ type: 'datetime', name: 'created_at' })
  createdAt: Date;
}
