import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/auth/decorators/user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserService } from '../services/user.service';
import { User, Prisma } from '@prisma/client';

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
  @UseGuards(JwtAuthGuard)
  async getAllUsersByShop(
    @Param('shopId') shopId: string,
    @Query('lastSyncTime') lastSyncTime: string,
    @Query('skip') skip: string,
    @Query('take') take: string,
  ) {
    const findConditions: Prisma.UserShopWhereInput = {};
    if (lastSyncTime) {
      findConditions.updatedAt = { gt: new Date(lastSyncTime) };
    }
    console.log(findConditions);
    const count = await this.userService.userCountByShopId(shopId);
    const users = await this.userService.findUsersByShopId(shopId, {
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
    console.log(findConditions);
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
}
