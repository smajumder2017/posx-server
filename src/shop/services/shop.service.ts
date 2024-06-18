import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/services/prisma.service';
import { Prisma } from '@prisma/client';
import { LicenseService } from 'src/license/services/license.service';
import { customAlphabet } from 'nanoid';
import moment from 'moment';

@Injectable()
export class ShopService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly licenseService: LicenseService,
  ) {}

  private generateShopCode(shopName: string) {
    const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let shopInitials = '';
    const splitted = shopName.toLowerCase().split(' ');
    splitted.forEach((part) => {
      shopInitials += part.charAt(0);
    });

    return `posx-${shopInitials}-${customAlphabet(alphabet.toLowerCase(), 10)()}`;
  }

  createShop(
    userId: string,
    shop: Omit<Prisma.ShopUncheckedCreateInput, 'shopCode'>,
  ) {
    return this.prismaService.$transaction(async (tx) => {
      const newShop = await tx.shop.create({
        data: { ...shop, shopCode: this.generateShopCode(shop.shopName) },
      });
      await tx.userShop.create({
        data: {
          userId,
          shopId: newShop.id,
        },
      });
      await this.licenseService.createLicense(
        {
          startDate: moment().toDate(),
          //TODO: Should be subscription end date
          endDate: moment().add(1, 'y').toDate(),
          shopId: newShop.id,
        },
        tx,
      );
      return newShop;
    });
  }

  updateShop(shop: Prisma.ShopUncheckedUpdateInput) {
    return this.prismaService.shop.update({
      where: { id: shop.id.toString() },
      data: shop,
    });
  }

  getShopById(id: string) {
    return this.prismaService.shop.findUnique({ where: { id } });
  }

  getShopByIdwithType(id: string) {
    return this.prismaService.shop.findUnique({
      where: { id },
      include: { shopType: true },
    });
  }

  getShopUserCount(whereOptions?: Prisma.UserShopCountArgs) {
    return this.prismaService.userShop.count(whereOptions);
  }

  findAllShopUsers(whereOptions: Prisma.UserShopFindManyArgs) {
    return this.prismaService.userShop.findMany(whereOptions);
  }

  getShopTypeCount(whereOptions?: Prisma.ShopTypeCountArgs) {
    return this.prismaService.shopType.count(whereOptions);
  }

  findAllShopTypes(whereOptions: Prisma.ShopTypeFindManyArgs) {
    return this.prismaService.shopType.findMany(whereOptions);
  }

  getAllUserShop(findOptions: Prisma.UserShopFindManyArgs) {
    return this.prismaService.userShop.findMany(findOptions);
  }

  getShopConfig(shopId: string) {
    return this.prismaService.shopConfig.findUnique({ where: { shopId } });
  }

  upsertShopConfig(
    shopConfig: Prisma.ShopConfigUncheckedCreateInput &
      Prisma.ShopConfigUncheckedUpdateInput,
  ) {
    return this.prismaService.shopConfig.upsert({
      where: { shopId: shopConfig.shopId },
      create: shopConfig,
      update: shopConfig,
    });
  }
}
