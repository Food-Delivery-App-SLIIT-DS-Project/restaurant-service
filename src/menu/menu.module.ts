import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MenuService } from './menu.service';
import { MenuController } from './menu.controller';
import { Menu, MenuSchema } from 'src/schemas/menu.schema';
import { Restaurant, RestaurantSchema } from 'src/schemas/restaurant.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Menu.name, schema: MenuSchema },
      { name: Restaurant.name, schema: RestaurantSchema },
    ]),
  ],
  controllers: [MenuController],
  providers: [MenuService],
})
export class MenuModule {}
