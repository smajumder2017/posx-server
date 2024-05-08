import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { RoleService } from '../services/role.service';
import { Prisma } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getUserstoSync(
    @Query('lastSyncTime') lastSyncTime: string,
    @Query('skip') skip: string,
    @Query('take') take: string,
  ) {
    const findConditions: Prisma.RoleWhereInput = {};
    if (lastSyncTime) {
      findConditions.updatedAt = { gt: new Date(lastSyncTime) };
    }
    console.log(findConditions);
    const count = await this.roleService.roleCount({ where: findConditions });
    const roles = await this.roleService.findAllRoles({
      where: findConditions,
      skip: parseInt(skip),
      take: parseInt(take),
    });
    return {
      roles,
      count,
      hasNext: parseInt(skip) + parseInt(take) < count,
    };
  }
}
