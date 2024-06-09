import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { DashboardService } from '../services/dashboard.service';
import { SalesDateRange } from '../dto/dashboard.dto';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('sales/:shopId')
  getSales(@Param('shopId') shopId: string) {
    return this.dashboardService.getSalesData(shopId);
  }

  @Post('sales/:shopId')
  getSalesByRange(
    @Param('shopId') shopId: string,
    @Body() dateRange: SalesDateRange,
  ) {
    return this.dashboardService.getSalesDataByRange(shopId, dateRange);
  }
}
