import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/services/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class CustomerService {
  constructor(private readonly prismaService: PrismaService) {}

  create(customer: Prisma.CustomerCreateInput) {
    return this.prismaService.customer.create({ data: customer });
  }

  getCustomerByContactNo(contactNo: string) {
    return this.prismaService.customer.findUnique({ where: { contactNo } });
  }
}
