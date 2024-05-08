import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/infra/database/services/prisma.service';

@Injectable()
export class MenuItemService {
  constructor(private readonly prismaService: PrismaService) {}

  create(menuCategory: Prisma.MenuCategoryCreateInput) {
    return this.prismaService.menuCategory.create({ data: menuCategory });
  }

  findMenuItemsByShopId(
    shopId: string,
    whereOptions?: Prisma.MenuItemsFindManyArgs,
  ) {
    return this.prismaService.menuItems.findMany({
      ...whereOptions,
      where: { shopId, ...whereOptions.where },
    });
  }

  getMenuItemCountByShop(shopId: string) {
    return this.prismaService.menuItems.count({ where: { shopId } });
  }
}
