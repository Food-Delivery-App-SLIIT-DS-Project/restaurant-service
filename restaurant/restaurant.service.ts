import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Restaurant, RestaurantDocument } from './entities/restaurant.entity';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { nanoid } from 'nanoid';

@Injectable()
export class RestaurantService {
  getRestaurant(arg0: { id: string }) {
    throw new Error('Method not implemented.');
  }
  constructor(
    @InjectModel(Restaurant.name)
    private restaurantModel: Model<RestaurantDocument>,
  ) {}

  // Create a new restaurant with custom restaurantId
  async create(dto: CreateRestaurantDto): Promise<Restaurant> {
    const restaurantId = 'rest_' + nanoid(10);
    const created = new this.restaurantModel({ ...dto, restaurantId });
    return created.save();
  }

  // Find all restaurants
  async findAll(): Promise<Restaurant[]> {
    return this.restaurantModel.find().lean().exec();
  }

  //find all restaurants with filters (isavailable,isverified)
  //this is used to show restaurants to customers
  async findAllWithFilters(): Promise<Restaurant[]> {
    return this.restaurantModel
      .find({ isOpen: true, isVerified: true })
      .lean()
      .exec();
  }

  // Find a restaurant by restaurantId
  async findOne(restaurantId: string): Promise<Restaurant | null> {
    return this.restaurantModel.findOne({ restaurantId }).lean().exec();
  }

  // Update a restaurant by restaurantId
  async update(
    restaurantId: string,
    dto: UpdateRestaurantDto,
  ): Promise<Restaurant | null> {
    return this.restaurantModel
      .findOneAndUpdate({ restaurantId }, dto, { new: true })
      .lean()
      .exec();
  }

  //update isverifed
  async updateIsVerified(
    restaurantId: string,
    isVerified: boolean,
  ): Promise<Restaurant | null> {
    return this.restaurantModel
      .findOneAndUpdate({ restaurantId }, { isVerified }, { new: true })
      .lean()
      .exec();
  }
  // Update isOpen
  async updateIsOpen(
    restaurantId: string,
    isOpen: boolean,
  ): Promise<Restaurant | null> {
    return this.restaurantModel
      .findOneAndUpdate({ restaurantId }, { isOpen }, { new: true })
      .lean()
      .exec();
  }

  // Delete a restaurant by restaurantId
  async delete(restaurantId: string): Promise<void> {
    await this.restaurantModel.findOneAndDelete({ restaurantId }).exec();
  }

  // Find a restaurant by name
  async findByName(name: string): Promise<Restaurant | null> {
    return this.restaurantModel.findOne({ name }).lean().exec();
  }

  // Find restaurants within a radius
  async findByLocation(
    latitude: number,
    longitude: number,
    radius: number,
  ): Promise<Restaurant[]> {
    return this.restaurantModel
      .find({
        location: {
          $geoWithin: {
            $centerSphere: [[longitude, latitude], radius / 3963.2],
          },
        },
      })
      .lean()
      .exec();
  }

  // Find restaurants by cuisine
  async findByCuisine(cuisine: string): Promise<Restaurant[]> {
    return this.restaurantModel.find({ cuisine }).lean().exec();
  }

  // Find restaurants by userId
  async findByUserId(userId: string): Promise<Restaurant[]> {
    return this.restaurantModel.find({ userId }).lean().exec();
  }

  // Find restaurants by rating
  async findByRating(rating: number): Promise<Restaurant[]> {
    return this.restaurantModel.find({ rating }).lean().exec();
  }
}
