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
  searchOrders(searchOptions: Prisma.OrderFindManyArgs) {
    return this.prismaService.order.findMany(searchOptions);
  }

  getOrderCount(countOptions: Prisma.OrderCountArgs) {
    return this.prismaService.order.count(countOptions);
  }

  findOrderById(orderId: string) {
    return this.prismaService.order.findUnique({
      where: { id: orderId },
      include: {
        items: { where: { rejectionReason: null } },
        customer: true,
        deliveryPartner: true,
      },
    });
  }
}
