import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { MenuCategoryService } from '../services/menu-category.service';
import { Prisma } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { MenuItemService } from '../services/menu-item.service';

@Controller('menu')
export class MenuController {
  constructor(
    private readonly menuCategoryService: MenuCategoryService,
    private readonly menuItemService: MenuItemService,
  ) {}

  @Get('category/:shopId')
  @UseGuards(JwtAuthGuard)
  async getAllMenuCategoryByShop(
    @Param('shopId') shopId: string,
    @Query('lastSyncTime') lastSyncTime: string,
    @Query('skip') skip: string,
    @Query('take') take: string,
  ) {
    const findConditions: Prisma.MenuCategoryWhereInput = {};
    if (lastSyncTime) {
      findConditions.updatedAt = { gt: new Date(lastSyncTime) };
    }

    const count =
      await this.menuCategoryService.getMenuCategoryCountByShop(shopId);
    const users = await this.menuCategoryService.findMenuCategoryByShopId(
      shopId,
      {
        where: findConditions,
        skip: parseInt(skip),
        take: parseInt(take),
      },
    );
    return {
      menuCategories: users.map((category) => category),
      count,
      hasNext: parseInt(skip) + parseInt(take) < count,
    };
  }

  @Get('item/:shopId')
  @UseGuards(JwtAuthGuard)
  async getAllMenuItemsByShop(
    @Param('shopId') shopId: string,
    @Query('lastSyncTime') lastSyncTime: string,
    @Query('skip') skip: string,
    @Query('take') take: string,
  ) {
    const findConditions: Prisma.MenuItemsWhereInput = {};
    if (lastSyncTime) {
      findConditions.updatedAt = { gt: new Date(lastSyncTime) };
    }

    const count = await this.menuItemService.getMenuItemCountByShop(shopId);
    const items = await this.menuItemService.findMenuItemsByShopId(shopId, {
      where: findConditions,
      skip: parseInt(skip),
      take: parseInt(take),
    });
    return {
      menuItems: items.map((item) => {
        delete item.remoteImageId;
        return item;
      }),
      count,
      hasNext: parseInt(skip) + parseInt(take) < count,
    };
  }
}
