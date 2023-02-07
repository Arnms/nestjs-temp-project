import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { User } from './entities/user.entity';
import { EntityManager, FindOneOptions, FindOptionsWhere } from 'typeorm';
import { BaseService } from 'src/database/base/base.service';
import { UpdateUserDto } from './interfaces/user.dto';

@Injectable()
export class UserService extends BaseService<User> {
  constructor(private readonly userRepository: UserRepository) {
    super(userRepository);
  }

  findOneById(id: number): Promise<User> {
    return this.userRepository.findOne({
      where: {
        id,
      },
    });
  }

  findOneWithTransaction(options: FindOneOptions, manager?: EntityManager) {
    return this.userRepository.getById(2, manager);
  }

  findOne(options: FindOneOptions) {
    return this.userRepository.findOne(options);
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  update(
    options: FindOptionsWhere<User>,
    entity: UpdateUserDto,
    manager?: EntityManager,
  ) {
    return this.userRepository.updateTransaction(options, entity, manager);
  }
}
