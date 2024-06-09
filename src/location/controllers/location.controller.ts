import { Controller, Get, Query } from '@nestjs/common';
import { LocationService } from '../services/location.service';

@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Get()
  async getLocation(@Query('address') address: string) {
    return this.locationService.searchAddress(address);
  }
}
