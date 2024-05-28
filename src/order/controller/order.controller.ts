import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from '../services/order.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Prisma } from '@prisma/client';
import { CreateOrderDto } from '../dto/order.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER', 'ADMIN')
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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER', 'ADMIN')
  @Post()
  async create(@Body() upsertOrderDto: CreateOrderDto) {
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

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER', 'ADMIN', 'MANAGER')
  @Get(':orderId')
  async getOrderById(@Param('orderId') orderId: string) {
    return this.orderService.findOrderById(orderId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER', 'ADMIN', 'MANAGER')
  @Get()
  async getOrders(
    @Query('shopId') shopId: string,
    @Query('orderStatusId') orderStatusId?: string,
    @Query('isClosed') isClosed?: string,
    @Query('employeeId') employeeId?: string,
    @Query('skip') skip: string = '0',
    @Query('take') take: string = '100',
  ) {
    const whereOptions: Prisma.OrderWhereInput = { shopId };
    if (orderStatusId) {
      whereOptions.orderStatusId = parseInt(orderStatusId);
    }
    if (isClosed) {
      whereOptions.isClosed = isClosed === 'true';
    }
    if (employeeId) {
      whereOptions.employeeId = employeeId;
    }
    const count = await this.orderService.getOrderCount({
      where: whereOptions,
    });
    const orders = await this.orderService.searchOrders({
      where: whereOptions,
      include: { orderStatus: true, employee: true, customer: true },
      skip: parseInt(skip),
      take: parseInt(take),
      orderBy: {
        createdAt: 'desc',
      },
    });
    return {
      orders,
      count,
    };
  }
}
