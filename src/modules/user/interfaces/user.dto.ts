import { PartialType, PickType } from '@nestjs/mapped-types';
import { User } from '../entities/user.entity';

export class UpdateUserDto extends PartialType(
  PickType(User, ['password', 'permission', 'refreshToken']),
) {}
