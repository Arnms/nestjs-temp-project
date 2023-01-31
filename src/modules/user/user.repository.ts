import { Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { User } from './entities/user.entity';
import { BaseRepository } from 'src/database/base/base.repository';

@Injectable()
export class UserRepository extends BaseRepository<User> {
  constructor(
    @Inject('CONNECTION')
    readonly dataSource: DataSource,
  ) {
    super(dataSource.getRepository(User));
  }
}
