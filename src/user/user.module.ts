import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { DatabaseModule } from 'src/infra/database/database.module';
import { UserController } from './controllers/user.controller';

@Module({
  imports: [DatabaseModule],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
