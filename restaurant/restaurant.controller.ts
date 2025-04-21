import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { RestaurantService } from './restaurant.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';

@Controller()
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @GrpcMethod('RestaurantService', 'CreateRestaurant')
  async createRestaurant(data: CreateRestaurantDto) {
    const restaurant = await this.restaurantService.create(data);
    return { restaurant };
  }

  @GrpcMethod('RestaurantService', 'GetRestaurant')
  async getRestaurant({ id }: { id: string }) {
    const restaurant = await this.restaurantService.findOne(id);
    return restaurant ? { restaurant } : null;
  }

  @GrpcMethod('RestaurantService', 'GetAllRestaurants')
  async getAllRestaurants() {
    const restaurants = await this.restaurantService.findAll();
    return { restaurants };
  }

  @GrpcMethod('RestaurantService', 'UpdateRestaurant')
  async updateRestaurant(data: UpdateRestaurantDto & { id: string }) {
    const updated = await this.restaurantService.update(data.id, data);
    return updated ? { restaurant: updated } : null;
  }

  @GrpcMethod('RestaurantService', 'DeleteRestaurant')
  async deleteRestaurant({ id }: { id: string }) {
    await this.restaurantService.delete(id);
    return {};
  }

  // NEW: Find by name
  @GrpcMethod('RestaurantService', 'GetRestaurantByName')
  async getRestaurantByName({ name }: { name: string }) {
    const restaurant = await this.restaurantService.findByName(name);
    console.log('Restaurant by name:', restaurant);
    return restaurant ? { restaurant } : null;
  }

  // NEW: Find by cuisine
  @GrpcMethod('RestaurantService', 'GetRestaurantsByCuisine')
  async getRestaurantsByCuisine({ cuisine }: { cuisine: string }) {
    const restaurants = await this.restaurantService.findByCuisine(cuisine);
    console.log('Restaurants by cuisine:', restaurants);
    return { restaurants };
  }

  // NEW: Find by user ID
  @GrpcMethod('RestaurantService', 'GetRestaurantsByUserId')
  async getRestaurantsByUserId({ userId }: { userId: string }) {
    const restaurants = await this.restaurantService.findByUserId(userId);
    return { restaurants };
  }

  // NEW: Find by rating
  @GrpcMethod('RestaurantService', 'GetRestaurantsByRating')
  async getRestaurantsByRating({ rating }: { rating: number }) {
    const restaurants = await this.restaurantService.findByRating(rating);
    return { restaurants };
  }

  // NEW: Find by geolocation
  @GrpcMethod('RestaurantService', 'GetRestaurantsByLocation')
  async getRestaurantsByLocation({
    latitude,
    longitude,
    radius,
  }: {
    latitude: number;
    longitude: number;
    radius: number;
  }) {
    const restaurants = await this.restaurantService.findByLocation(
      latitude,
      longitude,
      radius,
    );
    return { restaurants };
  }
}
