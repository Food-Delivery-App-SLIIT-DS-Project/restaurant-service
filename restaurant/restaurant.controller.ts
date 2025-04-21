import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { RestaurantService } from './restaurant.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';

@Controller()
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  // rpc CreateRestaurant(CreateRestaurantRequest) returns (Restaurant);
  @GrpcMethod('RestaurantService', 'CreateRestaurant')
  async createRestaurant(data: CreateRestaurantDto) {
    const restaurant = await this.restaurantService.create(data);
    return { restaurant };
  }

  // rpc GetRestaurant(Id) returns (Restaurant);
  @GrpcMethod('RestaurantService', 'GetRestaurant')
  async getRestaurant({ id }: { id: string }) {
    console.log('Fetching restaurant with id:', id);
    const restaurant = await this.restaurantService.findOne(id);
    console.log('Fetched restaurant:', restaurant);
    if (!restaurant) return null;
    return { restaurant };
  }
  // rpc GetAllRestaurants(google.protobuf.Empty) returns (RestaurantList);
  @GrpcMethod('RestaurantService', 'GetAllRestaurants')
  async getAllRestaurants() {
    const restaurants = await this.restaurantService.findAll();
    console.log('Fetched all restaurants:', restaurants);
    return { restaurants };
  }

  // rpc UpdateRestaurant(UpdateRestaurantRequest) returns (Restaurant);
  @GrpcMethod('RestaurantService', 'UpdateRestaurant')
  async updateRestaurant(data: UpdateRestaurantDto & { id: string }) {
    const updated = await this.restaurantService.update(data.id, data);
    if (!updated) return null;
    console.log('Updated restaurant:', updated);
    return { restaurant: updated };
  }

  // rpc DeleteRestaurant(Id) returns (google.protobuf.Empty);
  @GrpcMethod('RestaurantService', 'DeleteRestaurant')
  async deleteRestaurant({ id }: { id: string }) {
    await this.restaurantService.delete(id);
    console.log('Restaurant deleted with id:', id);
    return {}; // empty message
  }
}
