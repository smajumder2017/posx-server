import { SetMetadata } from '@nestjs/common';
// import { Roles as Role } from 'src/enums';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
