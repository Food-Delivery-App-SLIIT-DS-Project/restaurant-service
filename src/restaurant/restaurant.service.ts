/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Restaurant, RestaurantDocument } from '../schemas/restaurant.schema';
import {
  CreateRestaurantDto,
  DeleteResponse,
  FindOneDto,
  OrderAcceptedResponse,
  RestaurantList,
  RestaurantResponse,
  UpdateRestaurantDto,
} from 'src/types';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectModel(Restaurant.name)
    private restaurantModel: Model<RestaurantDocument>,
    @Inject('KAFKA_SERVICE_RESTAURANT') private readonly kafkaClient: ClientKafka,
  ) {}
  async onModuleInit() {
    await this.kafkaClient.connect();
  }
  // kafka function --- restaurant accept order  event producer-------------
  restaurantAcceptOrder(data: any): OrderAcceptedResponse {
    console.log('Restaurant Accept Order', data);
    this.kafkaClient.emit('ORDER_ACCEPTED', data);
    return { status: true };
  }

  async create(
    createRestaurantDto: CreateRestaurantDto,
  ): Promise<RestaurantResponse> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const restaurantId = uuid();
    const model = {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
      restaurantId,
      ...createRestaurantDto,
    };
    const newRestaurant = new this.restaurantModel(model);
    const save = await newRestaurant.save();
    console.log(save);
    return {
      id: save.restaurantId,
      userId: save.userId,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      restaurantName: save.restaurantName,
      address: save.address,
      openingHours: save.openingHours,
      cuisineType: save.cuisineType,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      createdAt: save.createdAt,
      updatedAt: save.updatedAt,
    };
  }

  async FindAllRestaurants(): Promise<RestaurantList> {
    const restaurants = await this.restaurantModel.find().exec();
    return {
      restaurants: restaurants.map((restaurant) => ({
        id: restaurant.restaurantId,
        userId: restaurant.userId,
        restaurantName: restaurant.restaurantName,
        address: restaurant.address,
        openingHours: restaurant.openingHours,
        cuisineType: restaurant.cuisineType,
      })),
    };
  }

  async findOne(data: FindOneDto): Promise<RestaurantResponse> {
    console.log('id---', data.id);
    const restaurant = await this.restaurantModel.findOne({
      restaurantId: data.id,
    });
    if (!restaurant) throw new NotFoundException('Restaurant not found');
    return {
      id: restaurant.restaurantId,
      userId: restaurant.userId,
      restaurantName: restaurant.restaurantName,
      address: restaurant.address,
      openingHours: restaurant.openingHours,
      cuisineType: restaurant.cuisineType,
      createdAt: restaurant.createdAt,
      updatedAt: restaurant.updatedAt,
    };
  }

  async update(updateDto: UpdateRestaurantDto): Promise<RestaurantResponse> {
    const updated = await this.restaurantModel.findOneAndUpdate(
      { restaurantId: updateDto.id },
      updateDto,
      { new: true },
    );

    if (!updated) throw new NotFoundException('Restaurant not found');
    return {
      id: updated.restaurantId,
      userId: updated.userId,
      restaurantName: updated.restaurantName,
      address: updated.address,
      openingHours: updated.openingHours,
      cuisineType: updated.cuisineType,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    };
  }

  async remove(data: FindOneDto): Promise<DeleteResponse> {
    const result = await this.restaurantModel.findOneAndDelete({
      restaurantId: data.id,
    });

    if (!result) throw new NotFoundException('Restaurant not found');
    return { success: true };
  }
}
