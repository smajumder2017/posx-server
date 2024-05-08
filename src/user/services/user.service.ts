import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/services/prisma.service';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async createUser(user: Prisma.UserCreateInput) {
    user.password = await bcrypt.hash(user.password, 10);
    return this.prismaService.user.create({ data: user });
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

  findUsersByShopId(
    shopId: string,
    whereOptions?: Prisma.UserShopFindManyArgs,
  ) {
    return this.prismaService.userShop.findMany({
      ...whereOptions,
      where: { shopId, ...whereOptions.where },
      include: {
        user: true,
      },
    });
  }

  userCountByShopId(shopId: string) {
    return this.prismaService.userShop.count({ where: { shopId } });
  }

  userRoleCount(whereOptions?: Prisma.UserRolesCountArgs) {
    return this.prismaService.userRoles.count(whereOptions);
  }

  findAllUserRoles(whereOptions: Prisma.UserRolesFindManyArgs) {
    return this.prismaService.userRoles.findMany(whereOptions);
  }
}
