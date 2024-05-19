import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/infra/database/database.module';
import { OrderService } from './services/order.service';
import { OrderController } from './controller/order.controller';

@Module({
  imports: [DatabaseModule],
  providers: [OrderService],
  controllers: [OrderController],
})
export class OrderModule {}
