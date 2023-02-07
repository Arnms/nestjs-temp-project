import { Injectable } from '@nestjs/common';
import {
  EntityManager,
  EntityTarget,
  FindManyOptions,
  FindOptionsWhere,
  In,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { Base } from './base.entity';

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

  updateTransaction(
    options: any,
    entity: Pick<T, string>,
    manager?: EntityManager,
  ) {
    return manager
      ? manager.update(this.getTarget(), options, entity)
      : this.update(options, entity);
  }
}
