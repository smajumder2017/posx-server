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
import { MenuCategoryService } from '../services/menu-category.service';
import { Prisma } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { MenuItemService } from '../services/menu-item.service';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { CreateCategoryDto, UpdateCategoryDto } from '../dto/menu-category.dto';
import { CreateMenuItemDto, UpdateMenuItemDto } from '../dto/menu-item.dto';

@Controller('menu')
export class MenuController {
  constructor(
    private readonly menuCategoryService: MenuCategoryService,
    private readonly menuItemService: MenuItemService,
  ) {}

  @Post('category')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER', 'ADMIN')
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    const menuCategories =
      await this.menuCategoryService.findMenuCategoryByShopId(
        createCategoryDto.shopId,
      );
    menuCategories.sort((a, b) => b.displayIndex - a.displayIndex);
    return this.menuCategoryService.create({
      ...createCategoryDto,
      displayIndex: menuCategories[0].displayIndex + 1,
    });
  }

  @Put('category')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER', 'ADMIN')
  async updateCategory(@Body() updateCategoryDto: UpdateCategoryDto) {
    return this.menuCategoryService.update(updateCategoryDto);
  }

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
    const categories = await this.menuCategoryService.findMenuCategoryByShopId(
      shopId,
      {
        where: findConditions,
        skip: parseInt(skip),
        take: parseInt(take),
      },
    );
    return {
      menuCategories: categories.map((category) => category),
      count,
      hasNext: parseInt(skip) + parseInt(take) < count,
    };
  }

  generateShortCode(itemName: string) {
    const splitted = itemName.split(' ');
    let shortCode = '';
    splitted.forEach((word) => {
      shortCode += word.charAt(0).toUpperCase();
    });
    return shortCode;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER', 'ADMIN')
  @Post('item')
  async createMenuItem(@Body() createMenuItemDto: CreateMenuItemDto) {
    let newShortCode = this.generateShortCode(createMenuItemDto.itemName);
    const existing = await this.menuItemService.findMenuItemsByShopId(
      createMenuItemDto.shopId,
      { where: { shortCode: newShortCode } },
    );
    if (existing.length) {
      newShortCode += existing.length;
    }
    return this.menuItemService.create({
      ...createMenuItemDto,
      shortCode: newShortCode,
      isActive: true,
    });
  }

  @Put('item')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER', 'ADMIN')
  async updateMenuItem(@Body() updateMenuItemDto: UpdateMenuItemDto) {
    return this.menuItemService.update(updateMenuItemDto);
  }

  @Get('item/:shopId')
  @UseGuards(JwtAuthGuard)
  async getAllMenuItemsByShop(
    @Param('shopId') shopId: string,
    @Query('skip') skip: string,
    @Query('take') take: string,
    @Query('includes') includes?: 'category' | 'shop',
    @Query('lastSyncTime') lastSyncTime?: string,
  ) {
    const findConditions: Prisma.MenuItemsWhereInput = {};
    const include: Prisma.MenuItemsInclude = {};
    if (lastSyncTime) {
      findConditions.updatedAt = { gt: new Date(lastSyncTime) };
    }

    if (includes) {
      const includedSchemas = includes.split(',');
      includedSchemas.forEach((schema) => {
        include[schema] = true;
      });
    }

    const count = await this.menuItemService.getMenuItemCountByShop(shopId);
    const items = await this.menuItemService.findMenuItemsByShopId(shopId, {
      where: findConditions,
      include,
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
