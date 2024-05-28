import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from 'src/auth/decorators/user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserService } from '../services/user.service';
import { User, Prisma } from '@prisma/client';
import { ChangeUserRolesDto, CreateUsersDto } from '../dto/users.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtPayload } from 'src/auth/interfaces';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  // @ApiResponse({
  //   status: 200,
  //   description: 'The found record',
  //   type: UserInfoResponseDto,
  // })
  // @ApiSecurity('bearer')
  // @ApiBearerAuth()
  // for api documentation
  @UseGuards(JwtAuthGuard)
  @Get('info')
  async getUserInfo(@GetUser() user: User) {
    const userInfo = await this.userService.getUserById(user.id);
    delete userInfo.password;
    return userInfo;
  }

  @Get('shop/:shopId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER', 'ADMIN')
  async getShopUsers(
    @Param('shopId') shopId: string,
    @Query('skip') skip: string,
    @Query('take') take: string,
    @Query('lastSyncTime') lastSyncTime?: string,
  ) {
    const findConditions: Prisma.UserShopWhereInput = {};
    if (lastSyncTime) {
      findConditions.updatedAt = { gt: new Date(lastSyncTime) };
    }

    const count = await this.userService.shopUserCountByShopId(shopId);
    const users = await this.userService.findShopUsersByShopId(shopId, {
      where: findConditions,
      skip: parseInt(skip),
      take: parseInt(take),
    });
    return {
      users: users.map((shopUser) => shopUser.user),
      count,
      hasNext: parseInt(skip) + parseInt(take) < count,
    };
  }

  @Get('all/:shopId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER', 'ADMIN')
  async getAllUsersByShop(
    @Param('shopId') shopId: string,
    @Query('skip') skip: string,
    @Query('take') take: string,
    @GetUser() user: JwtPayload,
  ) {
    const findConditions: Prisma.UserWhereInput = {
      userShops: { some: { shopId, userId: { not: user.id } } },
      userRoles: { every: { role: { value: { not: 'OWNER' } } } },
    };
    const count = await this.userService.userCountByShopId(findConditions);
    const users = await this.userService.findAllUsers({
      where: findConditions,
      include: { userRoles: { include: { role: true } } },
      skip: parseInt(skip),
      take: parseInt(take),
    });
    return {
      users: users,
      count,
      hasNext: parseInt(skip) + parseInt(take) < count,
    };
  }

  @Get(':userId/roles')
  @UseGuards(JwtAuthGuard)
  async getUserRoles(
    @Param('userId') userId: string,
    @Query('lastSyncTime') lastSyncTime: string,
    @Query('skip') skip: string,
    @Query('take') take: string,
  ) {
    const findConditions: Prisma.UserRolesWhereInput = { userId };
    if (lastSyncTime) {
      findConditions.updatedAt = { gt: new Date(lastSyncTime) };
    }

    const count = await this.userService.userRoleCount({
      where: findConditions,
    });
    const userRoles = await this.userService.findAllUserRoles({
      where: findConditions,
      skip: parseInt(skip),
      take: parseInt(take),
    });
    return {
      userRoles,
      count,
      hasNext: parseInt(skip) + parseInt(take) < count,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER', 'ADMIN')
  @Post()
  createUser(@Body() createUserDto: CreateUsersDto) {
    const { shopId, ...user } = createUserDto;
    return this.userService.createUser(user, shopId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER', 'ADMIN')
  @Put('roles')
  async updateUserRoles(@Body() updateUserRoles: ChangeUserRolesDto) {
    if (updateUserRoles.delete.length) {
      const delUserRoles = updateUserRoles.delete.map((id) => {
        return this.userService.deleteUserRole(id);
      });
      await Promise.all(delUserRoles);
    }
    await this.userService.createUserRoles(updateUserRoles.create);
    return;
  }
}
