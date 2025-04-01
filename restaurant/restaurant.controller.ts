import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RestaurantService } from './restaurant.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';

@Controller()
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @MessagePattern('createRestaurant')
  create(@Payload() createRestaurantDto: CreateRestaurantDto) {
    return this.restaurantService.create(createRestaurantDto);
  }

  @MessagePattern('findAllRestaurant')
  findAll() {
    return this.restaurantService.findAll();
  }

  @MessagePattern('findOneRestaurant')
  findOne(@Payload() id: number) {
    return this.restaurantService.findOne(id);
  }

  @MessagePattern('updateRestaurant')
  update(@Payload() updateRestaurantDto: UpdateRestaurantDto) {
    return this.restaurantService.update(updateRestaurantDto.id, updateRestaurantDto);
  }

  @MessagePattern('removeRestaurant')
  remove(@Payload() id: number) {
    return this.restaurantService.remove(id);
  }
}
