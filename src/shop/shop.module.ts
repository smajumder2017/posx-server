import { Module } from '@nestjs/common';
import { ShopService } from './services/shop.service';
import { DatabaseModule } from 'src/infra/database/database.module';
import { ShopController } from './controllers/shop.controller';
import { LicenseModule } from 'src/license/license.module';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [DatabaseModule, LicenseModule, UserModule, AuthModule],
  providers: [ShopService],
  controllers: [ShopController],
})
export class ShopModule {}
