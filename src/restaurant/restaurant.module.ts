import { Module } from '@nestjs/common';
import { MenuCategoryService } from './services/menu-category.service';
import { MenuItemService } from './services/menu-item.service';
import { DatabaseModule } from 'src/infra/database/database.module';
import { MenuController } from './controllers/menu.controller';

@Module({
  imports: [DatabaseModule],
  providers: [MenuCategoryService, MenuItemService],
  controllers: [MenuController],
})
export class RestaurantModule {}
