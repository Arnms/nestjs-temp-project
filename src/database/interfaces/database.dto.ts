import { FindOptionsWhere, ObjectID } from 'typeorm';

export type Criteria =
  | string
  | number
  | FindOptionsWhere<any>
  | Date
  | ObjectID
  | number[]
  | string[]
  | Date[]
  | ObjectID[];
