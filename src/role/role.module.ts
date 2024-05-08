import { Module } from '@nestjs/common';
import { RoleService } from './services/role.service';
import { DatabaseModule } from 'src/infra/database/database.module';
import { RoleController } from './controllers/role.controller';

@Module({
  imports: [DatabaseModule],
  providers: [RoleService],
  controllers: [RoleController],
})
export class RoleModule {}
