import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/services/prisma.service';
import { Prisma } from '@prisma/client';
import { LicenseService } from 'src/license/services/license.service';
import { customAlphabet } from 'nanoid';
import * as moment from 'moment';

@Injectable()
export class ShopService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly licenseService: LicenseService,
  ) {}

  private generateShopCode(shopName: string) {
    const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const shopInitials =
      shopName.toLowerCase().split(' ')[0].charAt[0] +
        shopName.toLowerCase().split(' ')[1]?.charAt[0] || '';
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

  getShopById(id: string) {
    return this.prismaService.shop.findUnique({ where: { id } });
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
}
