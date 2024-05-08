import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/infra/database/services/prisma.service';

@Injectable()
export class RoleService {
  constructor(private readonly prismaService: PrismaService) {}
  findAllRoles(whereOptions: Prisma.RoleFindManyArgs) {
    return this.prismaService.role.findMany(whereOptions);
  }

  roleCount(whereOptions?: Prisma.RoleCountArgs) {
    return this.prismaService.role.count(whereOptions);
  }
}
