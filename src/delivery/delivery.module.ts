import { Module } from '@nestjs/common';
import { DeliveryService } from './services/delivery.service';
import { DatabaseModule } from '../infra/database/database.module';
import { DeliveryController } from './controllers/delivery.controller';

@Module({
  imports: [DatabaseModule],
  providers: [DeliveryService],
  controllers: [DeliveryController],
})
export class DeliveryModule {}
