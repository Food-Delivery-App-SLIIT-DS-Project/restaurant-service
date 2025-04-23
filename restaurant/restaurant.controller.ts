import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { RestaurantService } from './restaurant.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';

@Controller()
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  // gRPC method to create a new restaurant
  @GrpcMethod('RestaurantService', 'CreateRestaurant')
  async createRestaurant(data: CreateRestaurantDto) {
    const restaurant = await this.restaurantService.create(data);
    console.log('Created restaurant:', restaurant);
    return { restaurant };
  }

  // gRPC method to fetch a single restaurant by restaurantId
  @GrpcMethod('RestaurantService', 'GetRestaurant')
  async getRestaurant({ restaurantId }: { restaurantId: string }) {
    const restaurant = await this.restaurantService.findOne(restaurantId);
    console.log('Fetched restaurant:', restaurant);
    return restaurant ? { restaurant } : null;
  }

  // gRPC method to fetch all restaurants
  @GrpcMethod('RestaurantService', 'GetAllRestaurants')
  async getAllRestaurants() {
    const restaurants = await this.restaurantService.findAll();
    console.log('Fetched all restaurants:', restaurants);
    return { restaurants };
  }
  // gRPC method to fetch all restaurants with filters
  @GrpcMethod('RestaurantService', 'GetAllRestaurantsWithFilters')
  async getAllRestaurantsWithFilters() {
    const restaurants = await this.restaurantService.findAllWithFilters();
    console.log('Fetched all restaurants with filters:', restaurants);
    return { restaurants };
  }

  // gRPC method to update a restaurant by restaurantId
  @GrpcMethod('RestaurantService', 'UpdateRestaurant')
  async updateRestaurant(data: UpdateRestaurantDto & { restaurantId: string }) {
    const updated = await this.restaurantService.update(
      data.restaurantId,
      data,
    );
    console.log('Updated restaurant:', updated);
    return updated ? { restaurant: updated } : null;
  }
  // gRPC method to update the isVerified status of a restaurant
  @GrpcMethod('RestaurantService', 'UpdateIsVerified')
  async updateIsVerified({
    restaurantId,
    isVerified,
  }: {
    restaurantId: string;
    isVerified: boolean;
  }) {
    const updated = await this.restaurantService.updateIsVerified(
      restaurantId,
      isVerified,
    );
    console.log('Updated restaurant verification status:', updated);
    return updated ? { restaurant: updated } : null;
  }

  // gRPC method to update the isOpen status of a restaurant
  @GrpcMethod('RestaurantService', 'UpdateIsOpen')
  async updateIsOpen({
    restaurantId,
    isOpen,
  }: {
    restaurantId: string;
    isOpen: boolean;
  }) {
    const updated = await this.restaurantService.updateIsOpen(
      restaurantId,
      isOpen,
    );
    console.log('Updated restaurant open status:', updated);
    return updated ? { restaurant: updated } : null;
  }

  // gRPC method to delete a restaurant by restaurantId
  @GrpcMethod('RestaurantService', 'DeleteRestaurant')
  async deleteRestaurant({ restaurantId }: { restaurantId: string }) {
    await this.restaurantService.delete(restaurantId);
    console.log('Deleted restaurant with ID:', restaurantId);
    return { message: 'Restaurant deleted successfully' };
  }

  // gRPC method to get a restaurant by its name
  @GrpcMethod('RestaurantService', 'GetRestaurantByName')
  async getRestaurantByName({ name }: { name: string }) {
    const restaurant = await this.restaurantService.findByName(name);
    console.log('Restaurant by name:', restaurant);
    return restaurant ? { restaurant } : null;
  }

  // gRPC method to get restaurants by their cuisine type
  @GrpcMethod('RestaurantService', 'GetRestaurantsByCuisine')
  async getRestaurantsByCuisine({ cuisine }: { cuisine: string }) {
    const restaurants = await this.restaurantService.findByCuisine(cuisine);
    console.log('Restaurants by cuisine:', restaurants);
    return { restaurants };
  }

  // gRPC method to get restaurants created by a specific user
  @GrpcMethod('RestaurantService', 'GetRestaurantsByUserId')
  async getRestaurantsByUserId({ userId }: { userId: string }) {
    const restaurants = await this.restaurantService.findByUserId(userId);
    console.log('Restaurants by user ID:', restaurants);
    return { restaurants };
  }

  // gRPC method to get restaurants filtered by rating
  @GrpcMethod('RestaurantService', 'GetRestaurantsByRating')
  async getRestaurantsByRating({ rating }: { rating: number }) {
    const restaurants = await this.restaurantService.findByRating(rating);
    return { restaurants };
  }

  // gRPC method to get restaurants within a given geographic radius
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
    console.log('Restaurants by location:', restaurants);
    return { restaurants };
  }
}
