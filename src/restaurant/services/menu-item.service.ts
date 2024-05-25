import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/infra/database/services/prisma.service';

@Injectable()
export class MenuItemService {
  constructor(private readonly prismaService: PrismaService) {}

  create(menuItem: Prisma.MenuItemsUncheckedCreateInput) {
    return this.prismaService.menuItems.create({ data: menuItem });
  }

  update(menuItem: Prisma.MenuItemsUncheckedUpdateInput) {
    return this.prismaService.menuItems.update({
      data: menuItem,
      where: { id: menuItem.id.toString() },
    });
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
