/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Controller } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import {
  CreateRestaurantDto,
  DeleteResponse,
  Empty,
  FindOneDto,
  OrderAcceptedDto,
  OrderAcceptedResponse,
  RestaurantList,
  RestaurantResponse,
  RestaurantServiceController,
  RestaurantServiceControllerMethods,
  UpdateRestaurantDto,
} from 'src/types';
import { from, Observable } from 'rxjs';
@RestaurantServiceControllerMethods()
@Controller()
export class RestaurantController implements RestaurantServiceController {
  constructor(private readonly restaurantService: RestaurantService) {}

  restaurantAcceptOrder(request: OrderAcceptedDto): OrderAcceptedResponse{
    console.log('restaurantAcceptOrder', request);
    return this.restaurantService.restaurantAcceptOrder(request);
  }

  createRestaurant(request: CreateRestaurantDto): Promise<RestaurantResponse> {
    console.log('createRestaurant', request);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    return this.restaurantService.create(request);
  }
  findRestaurantById(request: FindOneDto): Promise<RestaurantResponse> {
    console.log('findRestaurantById', request);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    return this.restaurantService.findOne(request);
  }
  findAllRestaurants(request: Empty): Observable<RestaurantList> {
    console.log('findAllRestaurants', request);
    return from(this.restaurantService.FindAllRestaurants());
  }
  updateRestaurant(
    request: UpdateRestaurantDto,
  ): Observable<RestaurantResponse> {
    console.log('updateRestaurant', request);
    return from(this.restaurantService.update(request));
  }
  deleteRestaurant(request: FindOneDto): Promise<DeleteResponse> {
    console.log('deleteRestaurant', request);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    return this.restaurantService.remove(request);
  }
}
