import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CustomerService } from '../services/customer.service';
import { CreateCustomerDto } from '../dto/customer.dto';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}
  @Post()
  create(@Body() customerDto: CreateCustomerDto) {
    return this.customerService.create(customerDto);
  }

  @Get()
  getCustomerByContactNo(@Query('contactNo') contactNo: string) {
    return this.customerService.getCustomerByContactNo(contactNo);
  }
}
