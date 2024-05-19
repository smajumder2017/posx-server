import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/infra/database/services/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class CustomerService {
  logger = new Logger(CustomerService.name);
  constructor(private readonly prismaService: PrismaService) {}

  upsertCustomer(
    customer: Prisma.CustomerCreateInput & Prisma.CustomerUpdateInput,
  ) {
    return this.prismaService.customer.upsert({
      where: { contactNo: customer.contactNo },
      create: customer,
      update: {
        name: customer.name,
        gender: customer.gender,
        dob: customer.dob,
      },
    });
  }

  getCustomerByContactNo(contactNo: string) {
    return this.prismaService.customer.findUnique({ where: { contactNo } });
  }
}
