/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Restaurant, RestaurantDocument } from '../schemas/restaurant.schema';
import { ClientGrpc, ClientKafka } from '@nestjs/microservices';
import {
  CreateRestaurantRequest,
  CuisineRequest,
  LocationRequest,
  NameRequest,
  OrderAcceptedResponse,
  RestaurantId,
  RestaurantList,
  RestaurantResponse,
  UpdateIsOpenRequest,
  UpdateIsVerifiedRequest,
  UpdateRestaurantRequest,
  UserIdRequest,
} from 'src/types/restaurant';
import { ORDER_SERVICE_NAME, OrderServiceClient } from 'src/types/order';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class RestaurantService implements OnModuleInit {
  private orderServiceClient: OrderServiceClient; 

  constructor(
    @InjectModel(Restaurant.name)
    private restaurantModel: Model<RestaurantDocument>,
    @Inject('KAFKA_SERVICE_RESTAURANT')
    private readonly kafkaClient: ClientKafka,
    @Inject(ORDER_SERVICE_NAME)
    private client: ClientGrpc,
  ) {}

  async onModuleInit() {
    console.log('onModuleInit--');
    await this.kafkaClient.connect();
    this.orderServiceClient = this.client.getService<OrderServiceClient>(ORDER_SERVICE_NAME);
  }


  // kafka function --- restaurant accept order  event producer-------------
  async restaurantOrderAcceptOrReject(
    data: any,
  ): Promise<OrderAcceptedResponse> {
    console.log(data);
    const { restaurantId, orderId } = data;
    if (!restaurantId || !orderId) {
      throw new BadRequestException('restaurantId and orderId are required');
    }
    // Check if the restaurant exists
    const restaurant = await this.restaurantModel.findOne({ restaurantId });
    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }
    // get order details from order Id
    const order = await firstValueFrom(this.orderServiceClient.findOneOrder({ orderId }));


    const location = restaurant.location;
    const orderDetails = {
      restaurantId,
      order,
      location,
    };
    // Emit the event to Kafka
    console.log('Restaurant Accept Order', orderDetails);
    this.kafkaClient.emit('ORDER_ACCEPTED', orderDetails);
    return { status: true };
  }

  // create restaurnat ------------------------------------
  async createRestaurant(
    data: CreateRestaurantRequest,
  ): Promise<RestaurantResponse> {
    const restaurantId = uuid();

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

  //increase number of ratings ------------------
  async UpdateRating(restaurantId: string): Promise<RestaurantResponse> {
    const result = await this.restaurantModel.findOneAndUpdate(
      { restaurantId },
      { $inc: { numberOfRatings: 1 } },
      { new: true },
    );
    if (!result) throw new NotFoundException('Restaurant not found');
    return this.toResponse(result);
  }

  //decrease number of ratings--------------------------------------
  async DecreaseRating(restaurantId: string): Promise<RestaurantResponse> {
    const result = await this.restaurantModel.findOneAndUpdate(
      { restaurantId },
      { $inc: { numberOfRatings: -1 } },
      { new: true },
    );
    if (!result) throw new NotFoundException('Restaurant not found');
    return this.toResponse(result);
  }

  //get all restaurants ------------------------------------
  async getRestaurant(data: RestaurantId): Promise<RestaurantResponse> {
    const result = await this.restaurantModel.findOne({
      restaurantId: data.restaurantId,
    });
    if (!result) throw new NotFoundException('Restaurant not found');
    return this.toResponse(result);
  }

  //get all restaurants ------------------------------------
  async getAllRestaurants(): Promise<RestaurantList> {
    const restaurants = await this.restaurantModel.find();
    return { restaurants: restaurants.map((r) => this.toResponse(r)) };
  }

  //get all restaurants ------------------------------------
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

  //delete restaurant ------------------------------------
  async deleteRestaurant(data: {
    restaurantId: string;
  }): Promise<{ message: string }> {
    console.log('Trying to delete:', data.restaurantId);

    const found = await this.restaurantModel.findOne({
      restaurantId: data.restaurantId,
    });
    if (!found) {
      throw new NotFoundException(
        `Restaurant with ID ${data.restaurantId} not found`,
      );
    }
    await this.restaurantModel.deleteOne({ restaurantId: data.restaurantId });
    return { message: 'Restaurant deleted successfully' };
  }

  //get restaurant by name ------------------------------------
  async getRestaurantByName(data: NameRequest): Promise<RestaurantResponse> {
    const result = await this.restaurantModel.findOne({ name: data.name });
    if (!result) throw new NotFoundException('Restaurant not found');
    return this.toResponse(result);
  }

  //get restaurant by cuisine ------------------------------------
  async getRestaurantsByCuisine(data: CuisineRequest): Promise<RestaurantList> {
    const restaurants = await this.restaurantModel.find({
      cuisineType: data.cuisine,
    });
    return { restaurants: restaurants.map((r) => this.toResponse(r)) };
  }

  //get restaurant by userId ------------------------------------
  async getRestaurantsByUserId(data: UserIdRequest): Promise<RestaurantList> {
    const restaurants = await this.restaurantModel.find({
      userId: data.userId,
    });
    return { restaurants: restaurants.map((r) => this.toResponse(r)) };
  }

  //update restaurant isVerified ------------------------------------
  async updateIsVerified(
    data: UpdateIsVerifiedRequest,
  ): Promise<RestaurantResponse> {
    console.log('Received data for updateIsVerified:', data); // Log the incoming data
    if (data.isVerified === undefined) {
      throw new BadRequestException('isVerified field is required');
    }

    const result = await this.restaurantModel.findOneAndUpdate(
      { restaurantId: data.restaurantId }, // Find by restaurantId instead of _id
      { isVerified: data.isVerified }, // Update isVerified to the passed value
      { new: true }, // Return the updated document
    );

    if (!result) throw new NotFoundException('Restaurant not found');
    return this.toResponse(result);
  }

  //update restaurant isOpen ------------------------------------
  async updateIsOpen(data: UpdateIsOpenRequest): Promise<RestaurantResponse> {
    const result = await this.restaurantModel.findOneAndUpdate(
      { restaurantId: data.restaurantId }, // Find by restaurantId instead of _id
      { isOpen: data.isOpen },
      { new: true },
    );
    if (!result) throw new NotFoundException('Restaurant not found');
    return this.toResponse(result);
  }

  //get restaurant by location ------------------------------------
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

  async getAllRestaurantsWithFilters(): Promise<RestaurantList> {
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
