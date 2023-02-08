import { Injectable } from '@nestjs/common';
import { Base } from './base.entity';
import { BaseRepository } from './base.repository';
import { EntityManager } from 'typeorm';

@Injectable()
export class BaseService<T extends Base> {
  constructor(private readonly repository: BaseRepository<T>) {}

  getById(id: number, manager?: EntityManager): Promise<T> {
    return this.repository.getById(id, manager);
  }

  getByIds(ids: number[], manager?: EntityManager): Promise<T[]> {
    return this.repository.getByIds(ids, manager);
  }
}
