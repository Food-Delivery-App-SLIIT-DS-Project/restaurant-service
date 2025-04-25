/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  RestaurantResponse,
  CreateRestaurantRequest,
  UpdateRestaurantRequest,
  RestaurantId,
  Empty,
  NameRequest,
  CuisineRequest,
  UserIdRequest,
  LocationRequest,
  RestaurantList,
  UpdateIsVerifiedRequest,
  UpdateIsOpenRequest,
} from '../proto/restaurant';
import { Restaurant, RestaurantDocument } from './entities/restaurant.entity';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectModel(Restaurant.name)
    private readonly restaurantModel: Model<RestaurantDocument>,
  ) {}

  async createRestaurant(
    data: CreateRestaurantRequest,
  ): Promise<RestaurantResponse> {
    const restaurantId = `restaurant${Date.now()}`;
  
    const created = new this.restaurantModel({
      ...data,
      restaurantId,
      numberOfRatings: 0,
      isOpen: false,
      isVerified: false,
    });
  
    const result = await created.save();
    return this.toResponse(result);
  }

  //increase number of ratings
  async UpdateRating(
    restaurantId: string,
  ): Promise<RestaurantResponse> {
    const result = await this.restaurantModel.findOneAndUpdate(
      { restaurantId },
      { $inc: { numberOfRatings: 1 } },
      { new: true },
    );
    if (!result) throw new NotFoundException('Restaurant not found');
    return this.toResponse(result);
  }
  //decrease number of ratings
  async DecreaseRating(
    restaurantId: string,
  ): Promise<RestaurantResponse> {
    const result = await this.restaurantModel.findOneAndUpdate(
      { restaurantId },
      { $inc: { numberOfRatings: -1 } },
      { new: true },
    );
    if (!result) throw new NotFoundException('Restaurant not found');
    return this.toResponse(result);
  }

  async getRestaurant(data: RestaurantId): Promise<RestaurantResponse> {
    const result = await this.restaurantModel.findOne({ restaurantId: data.restaurantId });
    if (!result) throw new NotFoundException('Restaurant not found');
    return this.toResponse(result);
  }
  async getAllRestaurants(_: Empty): Promise<RestaurantList> {
    const restaurants = await this.restaurantModel.find();
    return { restaurants: restaurants.map((r) => this.toResponse(r)) };
  }

  async updateRestaurant(
    data: UpdateRestaurantRequest,
  ): Promise<RestaurantResponse> {
    const result = await this.restaurantModel.findOneAndUpdate(
      { restaurantId: data.restaurantId }, 
      { ...data },
      { new: true },
    );
    if (!result) throw new NotFoundException('Restaurant not found');
    return this.toResponse(result);
  }
  

  async deleteRestaurant(data: { restaurantId: string }): Promise<{ message: string }> {
    console.log('Trying to delete:', data.restaurantId);
  
    const found = await this.restaurantModel.findOne({ restaurantId: data.restaurantId });
    if (!found) {
      throw new NotFoundException(`Restaurant with ID ${data.restaurantId} not found`);
    }
    await this.restaurantModel.deleteOne({ restaurantId: data.restaurantId });
    return { message: 'Restaurant deleted successfully' };
  }
  

  async getRestaurantByName(
    data: NameRequest,
  ): Promise<RestaurantResponse> {
    const result = await this.restaurantModel.findOne({ name: data.name });
    if (!result) throw new NotFoundException('Restaurant not found');
    return this.toResponse(result);
  }

  async getRestaurantsByCuisine(
    data: CuisineRequest,
  ): Promise<RestaurantList> {
    const restaurants = await this.restaurantModel.find({ cuisineType: data.cuisine });
    return { restaurants: restaurants.map((r) => this.toResponse(r)) };
  }

  async getRestaurantsByUserId(
    data: UserIdRequest,
  ): Promise<RestaurantList> {
    const restaurants = await this.restaurantModel.find({ userId: data.userId });
    return { restaurants: restaurants.map((r) => this.toResponse(r)) };
  }

  async updateIsVerified(
    data: UpdateIsVerifiedRequest,
  ): Promise<RestaurantResponse> {
    console.log('Received data for updateIsVerified:', data);  // Log the incoming data
    if (data.isVerified === undefined) {
      throw new BadRequestException('isVerified field is required');
    }
  
    const result = await this.restaurantModel.findOneAndUpdate(
      { restaurantId: data.restaurantId }, // Find by restaurantId instead of _id
      { isVerified: data.isVerified },     // Update isVerified to the passed value
      { new: true },                       // Return the updated document
    );
  
    if (!result) throw new NotFoundException('Restaurant not found');
    return this.toResponse(result);
  }
  
  

  async updateIsOpen(
    data: UpdateIsOpenRequest,
  ): Promise<RestaurantResponse> {
    const result = await this.restaurantModel.findOneAndUpdate(
      { restaurantId: data.restaurantId },  // Find by restaurantId instead of _id
      { isOpen: data.isOpen },
      { new: true },
    );
    if (!result) throw new NotFoundException('Restaurant not found');
    return this.toResponse(result);
  }
  
  async getRestaurantsByLocation(
    data: LocationRequest,
  ): Promise<RestaurantList> {
    const { latitude, longitude, radius } = data;
    const restaurants = await this.restaurantModel.find({
      location: {
        $geoWithin: {
          $centerSphere: [[longitude, latitude], radius / 6378.1],
        },
      },
    });
    return { restaurants: restaurants.map((r) => this.toResponse(r)) };
  }

  async getAllRestaurantsWithFilters(_: Empty): Promise<RestaurantList> {
    const restaurants = await this.restaurantModel.find({
      isOpen: true,
      isVerified: true,
    });
    return { restaurants: restaurants.map((r) => this.toResponse(r)) };
  }
  

  private toResponse(doc: RestaurantDocument): RestaurantResponse {
    return {
      restaurantId: doc.restaurantId,
      userId: doc.userId,
      name: doc.name,
      address: doc.address,
      location: doc.location,
      phone: doc.phone,
      cuisineType: doc.cuisineType,
      description: doc.description,
      openHours: doc.openHours,
      imageReference: doc.imageReference,
      numberOfRatings: doc.numberOfRatings,
      isOpen: doc.isOpen,
      isVerified: doc.isVerified,
    };
  }
}
