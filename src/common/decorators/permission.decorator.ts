import { SetMetadata } from '@nestjs/common';
import { UserPermission } from 'src/modules/user/interfaces/userPermission.dto';

export const Permission = (...permissions: UserPermission[]) =>
  SetMetadata('permissions', permissions);
