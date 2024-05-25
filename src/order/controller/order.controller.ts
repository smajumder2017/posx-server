import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { OrderService } from '../services/order.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Prisma } from '@prisma/client';
import { CreateOrderDto } from '../dto/order.dto';

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

  @UseGuards(JwtAuthGuard)
  @Post()
  async upsertOrder(@Body() upsertOrderDto: CreateOrderDto) {
    console.log(upsertOrderDto);
    const orderItems: Prisma.OrderItemCreateNestedManyWithoutOrderInput = {
      create: upsertOrderDto.items.map((item) => {
        delete item.orderId;
        return item;
      }),
    };
    const bills: Prisma.BillingCreateNestedManyWithoutOrderInput = {
      create: upsertOrderDto.bills.map((item) => {
        delete item.orderId;
        return item;
      }),
    };
    return this.orderService.create({
      ...upsertOrderDto,
      items: orderItems,
      bills,
    });
  }
}
