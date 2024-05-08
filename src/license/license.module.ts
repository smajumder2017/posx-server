import { Module } from '@nestjs/common';
import { LicenseService } from './services/license.service';
import { DatabaseModule } from 'src/infra/database/database.module';
import { LicenseController } from './controllers/license.controller';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [DatabaseModule, UserModule, AuthModule],
  providers: [LicenseService],
  exports: [LicenseService],
  controllers: [LicenseController],
})
export class LicenseModule {}
