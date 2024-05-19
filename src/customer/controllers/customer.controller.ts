import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { CustomerService } from '../services/customer.service';
import { UpserCustomerDto } from '../dto/customer.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}
  @UseGuards(JwtAuthGuard)
  @Post()
  upsert(@Body() customerDto: UpserCustomerDto) {
    console.log(customerDto);
    return this.customerService.upsertCustomer(customerDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getCustomerByContactNo(@Query('contactNo') contactNo: string) {
    return this.customerService.getCustomerByContactNo(contactNo);
  }
}
