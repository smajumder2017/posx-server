import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/services/prisma.service';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async createUser(user: Prisma.UserUncheckedCreateInput, shopId?: string) {
    user.password = await bcrypt.hash(user.password, 10);
    return this.prismaService.user.create({
      data: {
        ...user,
        userShops: shopId && {
          create: {
            shopId,
          },
        },
      },
    });
  }

  getUserById(id: string) {
    return this.prismaService.user.findUnique({
      where: { id },
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
        userShops: {
          include: {
            shop: true,
          },
        },
      },
    });
  }

  getUserByUserName(userName: string) {
    return this.prismaService.user.findUnique({
      where: { userName },
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
        userShops: {
          include: {
            shop: true,
          },
        },
      },
    });
  }

  getUserByEmail(email: string) {
    return this.prismaService.user.findUnique({
      where: { email },
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
        userShops: {
          include: {
            shop: true,
          },
        },
      },
    });
  }

  findAllUsers(whereOptions: Prisma.UserFindManyArgs) {
    return this.prismaService.user.findMany(whereOptions);
  }

  userCount(whereOptions?: Prisma.UserCountArgs) {
    return this.prismaService.user.count(whereOptions);
  }

  findShopUsersByShopId(
    shopId: string,
    whereOptions?: Prisma.UserShopFindManyArgs,
  ) {
    return this.prismaService.userShop.findMany({
      ...whereOptions,
      where: { shopId, ...whereOptions.where },
      include: {
        ...whereOptions.include,
        user: true,
      },
    });
  }

  shopUserCountByShopId(shopId: string) {
    return this.prismaService.userShop.count({ where: { shopId } });
  }

  userCountByShopId(whereCondition: Prisma.UserWhereInput) {
    return this.prismaService.user.count({
      where: whereCondition,
    });
  }

  userRoleCount(whereOptions?: Prisma.UserRolesCountArgs) {
    return this.prismaService.userRoles.count(whereOptions);
  }

  findAllUserRoles(whereOptions: Prisma.UserRolesFindManyArgs) {
    return this.prismaService.userRoles.findMany(whereOptions);
  }

  createUserRoles(userRoles: Prisma.UserRolesUncheckedCreateInput[]) {
    return this.prismaService.userRoles.createMany({ data: userRoles });
  }

  deleteUserRole(id: string) {
    return this.prismaService.userRoles.delete({ where: { id } });
  }
}
