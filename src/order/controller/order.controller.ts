import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { OrderService } from '../services/order.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Prisma } from '@prisma/client';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(JwtAuthGuard)
  @Get('order-status')
  async getOrderStatus(
    @Query('lastSyncTime') lastSyncTime: string,
    @Query('skip') skip: string,
    @Query('take') take: string,
  ) {
    const findConditions: Prisma.OrderStatusWhereInput = {};
    if (lastSyncTime) {
      findConditions.updatedAt = { gt: new Date(lastSyncTime) };
    }

    const count = await this.orderService.getAllOrderStatusesCount({
      where: findConditions,
    });
    const orderStatuses = await this.orderService.getAllOrderStatuses({
      where: findConditions,
      skip: parseInt(skip),
      take: parseInt(take),
    });
    return {
      orderStatuses,
      count,
      hasNext: parseInt(skip) + parseInt(take) < count,
    };
  }
}
