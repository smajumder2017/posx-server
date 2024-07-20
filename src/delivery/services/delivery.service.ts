import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../infra/database/services/prisma.service';

@Injectable()
export class DeliveryService {
  constructor(private readonly prismaService: PrismaService) {}

  createDelivery(delivery: Prisma.DeliveryUncheckedCreateInput) {
    return this.prismaService.delivery.create({ data: delivery });
  }

  getDeliveryById(id: string) {
    return this.prismaService.delivery.findUnique({
      where: { id },
      include: { deliveryStatus: true },
    });
  }
}
