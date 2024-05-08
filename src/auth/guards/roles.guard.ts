import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
// import { Roles as Role } from 'src/enums';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>(
      ROLES_KEY,
      context.getHandler(),
    );
    if (!requiredRoles) {
      return true;
    }
    const req = context.switchToHttp().getRequest();
    const roleValid = requiredRoles.some(
      (role) =>
        req.user.userRoles.filter((r) => {
          return r.role.value === role;
        }).length,
    );
    if (!roleValid) {
      throw new ForbiddenException(
        'You dont have enough rights to access this resource',
      );
    }
    return roleValid;
  }
}
