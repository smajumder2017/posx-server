import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './infra/database/database.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { LicenseModule } from './license/license.module';
import { ShopModule } from './shop/shop.module';
import { RoleModule } from './role/role.module';
import { RestaurantModule } from './restaurant/restaurant.module';
import { CustomerModule } from './customer/customer.module';
import { OrderModule } from './order/order.module';
import { PaymentModule } from './payment/payment.module';
import { BillingModule } from './billing/billing.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { LocationModule } from './location/location.module';
import { DeliveryModule } from './delivery/delivery.module';

@Module({
  imports: [
    RestaurantModule,
    RestaurantModule,
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UserModule,
    LicenseModule,
    ShopModule,
    RoleModule,
    RestaurantModule,
    CustomerModule,
    OrderModule,
    PaymentModule,
    BillingModule,
    DashboardModule,
    LocationModule,
    DeliveryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
