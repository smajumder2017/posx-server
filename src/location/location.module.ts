import { Module } from '@nestjs/common';
import { LocationService } from './services/location.service';
import { LocationController } from './controllers/location.controller';

@Module({
  providers: [LocationService],
  controllers: [LocationController]
})
export class LocationModule {}
