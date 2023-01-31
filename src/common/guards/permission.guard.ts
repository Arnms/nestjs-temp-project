import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { User } from 'src/modules/user/entities/user.entity';
import { UserPermission } from 'src/modules/user/interfaces/userPermission.dto';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const permissions = this.reflector.get<UserPermission[]>(
      'permissions',
      context.getHandler(),
    );

    if (!permissions.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest() as Request;
    const user = request.user as User;

    if (!user) {
      return false;
    } else if (!user?.permission) {
      return false;
    }

    return this.checkUserPermission(permissions, user.permission);
  }

  private checkUserPermission(
    permission: UserPermission[],
    userPermission: UserPermission[],
  ) {
    for (const p of permission) {
      const up = userPermission.find((v) => v.table === p.table);

      if (!up) {
        return false;
      }

      for (let i = 0; i < 3; i++) {
        const x = +Number(p.allow[i]).toString(2);
        const y = +Number(up.allow[i]).toString(2);

        if ((x & y) < x) {
          return false;
        }
      }
    }

    return true;
  }
}
