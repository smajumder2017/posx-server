import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/services/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class MenuCategoryService {
  constructor(private readonly prismaService: PrismaService) {}

  create(menuCategory: Prisma.MenuCategoryUncheckedCreateInput) {
    return this.prismaService.menuCategory.create({ data: menuCategory });
  }

  update(menuCategory: Prisma.MenuCategoryUncheckedUpdateInput) {
    return this.prismaService.menuCategory.update({
      data: menuCategory,
      where: { id: menuCategory.id.toString() },
    });
  }

  findMenuCategoryByShopId(
    shopId: string,
    whereOptions?: Prisma.MenuCategoryFindManyArgs,
  ) {
    return this.prismaService.menuCategory.findMany({
      ...whereOptions,
      where: { shopId, ...whereOptions?.where },
    });
  }

  getMenuCategoryCountByShop(shopId: string) {
    return this.prismaService.menuCategory.count({ where: { shopId } });
  }
}
