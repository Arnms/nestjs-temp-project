import {
  Controller,
  Get,
  Inject,
  UseGuards,
  UseInterceptors,
  forwardRef,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { TransactionInterceptor } from 'src/common/interceptors/transaction.interceptor';
import { TransactionManager } from 'src/common/decorators/transaction.decorator';
import { EntityManager } from 'typeorm';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Permission } from 'src/common/decorators/permission.decorator';
import { PermissionGuard } from 'src/common/guards/permission.guard';
import { userFindAllPermission } from './interfaces/user.permission';

@UseGuards(JwtAuthGuard, PermissionGuard)
@Controller('user')
export class UserController {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  @Get('/')
  @Permission(...userFindAllPermission)
  @UseInterceptors(TransactionInterceptor)
  async findAll(@TransactionManager() manager: EntityManager): Promise<User> {
    return await this.userService.findOneWithTransaction({}, manager);
  }
}
