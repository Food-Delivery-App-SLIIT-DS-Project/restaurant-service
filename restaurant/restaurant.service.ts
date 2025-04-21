import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Restaurant, RestaurantDocument } from './entities/restaurant.entity';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';

@Injectable()
export class RestaurantService {
  constructor(
    // Inject the Restaurant model for database operations
    @InjectModel(Restaurant.name)
    private restaurantModel: Model<RestaurantDocument>,
  ) {}
  // Define methods for CRUD operations
  // Create a new restaurant
  async create(dto: CreateRestaurantDto): Promise<Restaurant> {
    return this.restaurantModel.create(dto);
  }
  // Find all restaurants
  async findAll(): Promise<Restaurant[]> {
    return this.restaurantModel.find().lean().exec();
  }
  // Find a restaurant by ID
  // This method is used to find a restaurant by its unique ID --> it returns a single restaurant object
  async findOne(id: string): Promise<Restaurant | null> {
    return this.restaurantModel.findById(id).lean().exec();
  }
  // Update a restaurant by ID
  // This method is used to update a restaurant by its unique ID --> it returns the updated restaurant object
  async update(
    id: string,
    dto: UpdateRestaurantDto,
  ): Promise<Restaurant | null> {
    return this.restaurantModel
      .findByIdAndUpdate(id, dto, { new: true })
      .lean()
      .exec();
  }
  // Delete a restaurant by ID
  async delete(id: string): Promise<void> {
    await this.restaurantModel.findByIdAndDelete(id).exec();
  }
  // Find a restaurant by name
  async findByName(name: string): Promise<Restaurant | null> {
    return this.restaurantModel.findOne({ name }).lean().exec();
  }
  // Find a restaurant by location radius 5km
  async findByLocation(
    latitude: number,
    longitude: number,
    radius: number,
  ): Promise<Restaurant[]> {
    return this.restaurantModel
      .find({
        location: {
          $geoWithin: {
            $centerSphere: [
              [longitude, latitude],
              radius / 3963.2, // Convert radius from kilometers to radians
            ],
          },
        },
      })
      .lean()
      .exec();
  }
  // Find a restaurant by cuisine
  async findByCuisine(cuisine: string): Promise<Restaurant[]> {
    return this.restaurantModel.find({ cuisine }).lean().exec();
  }
  // Find a restaurant by userID
  async findByUserId(userId: string): Promise<Restaurant[]> {
    return this.restaurantModel.find({ userId }).lean().exec();
  }
  // Find a restaurant by rating
  async findByRating(rating: number): Promise<Restaurant[]> {
    return this.restaurantModel.find({ rating }).lean().exec();
  }
}
