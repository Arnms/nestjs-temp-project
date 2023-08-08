import { FindOptionsWhere, ObjectId } from 'typeorm';

export type Criteria =
  | string
  | number
  | FindOptionsWhere<any>
  | Date
  | ObjectId
  | number[]
  | string[]
  | Date[]
  | ObjectId[];
