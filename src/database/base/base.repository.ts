import { Injectable } from '@nestjs/common';
import {
  DeleteResult,
  EntityManager,
  EntityTarget,
  FindManyOptions,
  FindOptionsWhere,
  In,
  InsertResult,
  Repository,
  SelectQueryBuilder,
  UpdateResult,
} from 'typeorm';
import { Base } from './base.entity';
import { Criteria } from '../interfaces/database.dto';

@Injectable()
export class BaseRepository<T extends Base> extends Repository<T> {
  constructor(readonly repository: Repository<T>) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  getQueryBuilder(): SelectQueryBuilder<T> {
    return this.repository.createQueryBuilder();
  }

  getQueryManager(): EntityManager {
    return this.manager;
  }

  private getTarget(): EntityTarget<T> {
    return this.repository.target;
  }

  async returningEntity(
    result: Promise<InsertResult> | Promise<UpdateResult>,
  ): Promise<T> {
    return (await result)?.raw?.[0];
  }

  getById(id: number, manager?: EntityManager): Promise<T> {
    const options = { id } as FindOptionsWhere<T>;

    return manager
      ? manager.findOneBy(this.getTarget(), options)
      : this.findOneBy(options);
  }

  getByIds(ids: number[], manager?: EntityManager): Promise<T[]> {
    const options = {
      id: In(ids),
    } as FindManyOptions<T>;

    return manager
      ? manager.find(this.getTarget(), options)
      : this.find(options);
  }

  insertTransaction(
    entity: Pick<T, string>,
    manager?: EntityManager,
  ): Promise<InsertResult> {
    return manager
      ? manager.insert(this.getTarget(), entity)
      : this.insert(entity);
  }

  updateTransaction(
    options: Criteria,
    entity: Pick<T, string>,
    manager?: EntityManager,
  ): Promise<UpdateResult> {
    return manager
      ? manager.update(this.getTarget(), options, entity)
      : this.update(options, entity);
  }

  deleteTransaction(
    options: Criteria,
    manager?: EntityManager,
  ): Promise<DeleteResult> {
    return manager
      ? manager.delete(this.getTarget(), options)
      : this.delete(options);
  }
}
