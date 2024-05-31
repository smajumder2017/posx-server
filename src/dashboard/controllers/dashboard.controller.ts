import { Controller, Get, Param } from '@nestjs/common';
import { DashboardService } from '../services/dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('sales/:shopId')
  getSales(@Param('shopId') shopId: string) {
    return this.dashboardService.getSalesData(shopId);
  }
}
