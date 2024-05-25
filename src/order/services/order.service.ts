import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/infra/database/services/prisma.service';

@Injectable()
export class OrderService {
  constructor(private readonly prismaService: PrismaService) {}

  create(order: Prisma.OrderUncheckedCreateInput) {
    console.log(order);
    return this.prismaService.order.create({
      data: order,
    });
  }
  getAllOrderStatusesCount(searchOptions: Prisma.OrderStatusCountArgs) {
    return this.prismaService.orderStatus.count(searchOptions);
  }
  getAllOrderStatuses(searchOptions: Prisma.OrderStatusFindManyArgs) {
    return this.prismaService.orderStatus.findMany(searchOptions);
  }
}
