import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { DeliveryService } from '../services/delivery.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Prisma } from '@prisma/client';

@Controller('delivery')
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @Get('partners')
  @UseGuards(JwtAuthGuard)
  async getUserstoSync(
    @Query('lastSyncTime') lastSyncTime: string,
    @Query('skip') skip: string,
    @Query('take') take: string,
  ) {
    const findConditions: Prisma.DeliveryPartnerWhereInput = {};
    if (lastSyncTime) {
      findConditions.updatedAt = { gt: new Date(lastSyncTime) };
    }
    console.log(findConditions);
    const count = await this.deliveryService.deliveryPartnerCount({
      where: findConditions,
    });
    const deliveryPartners = await this.deliveryService.findAllDeliveryPartners(
      {
        where: findConditions,
        skip: parseInt(skip),
        take: parseInt(take),
      },
    );
    return {
      deliveryPartners,
      count,
      hasNext: parseInt(skip) + parseInt(take) < count,
    };
  }
}
