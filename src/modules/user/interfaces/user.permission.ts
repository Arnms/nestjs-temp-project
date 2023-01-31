import { UserPermission } from './userPermission.dto';

export const userFindAllPermission = [
  { table: 'user', allow: '400' },
] as UserPermission[];
