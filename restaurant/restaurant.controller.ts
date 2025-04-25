/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/await-thenable */
/* eslint-disable prettier/prettier */

import { Controller } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import {
  RestaurantServiceControllerMethods,
  RestaurantServiceController,
  CreateRestaurantRequest,
  RestaurantResponse,
  RestaurantId,
  RestaurantList,
  UpdateRestaurantRequest,
  NameRequest,
  CuisineRequest,
  UserIdRequest,
  LocationRequest,
  Empty,
  UpdateIsVerifiedRequest,
  UpdateIsOpenRequest,
} from '../proto/restaurant';
import { from, map, Observable, of } from 'rxjs';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';

@RestaurantServiceControllerMethods()
@Controller()
export class RestaurantController implements RestaurantServiceController {
  constructor(private readonly restaurantService: RestaurantService) {}

  createRestaurant(data: CreateRestaurantRequest): Observable<RestaurantResponse> {
    console.log('createRestaurant', data);
    return from(this.restaurantService.createRestaurant(data));
  }

  getRestaurant(data: RestaurantId): Observable<RestaurantResponse> {
    console.log('getRestaurant', data);
    const result = from(this.restaurantService.getRestaurant(data)).pipe(
      map((restaurant) => {
        if (!restaurant) {
          throw new RpcException({
            code: status.NOT_FOUND,
            message: 'Restaurant not found',
          });
        }
        return restaurant;
      }),
    );
    return result;
  }

  getAllRestaurants(_: Empty): Observable<RestaurantList> {
    return from(this.restaurantService.getAllRestaurants(_));
  }

  updateRestaurant(data: UpdateRestaurantRequest): Observable<RestaurantResponse> {
    console.log('updateRestaurant', data);
    return from(this.restaurantService.updateRestaurant(data));
  }

  updateRating(data: RestaurantId): Observable<Empty> { // Increase rating
    console.log('updateRating', data);
    return from(this.restaurantService.UpdateRating(data.restaurantId));
  }
  decreaseRating(data: RestaurantId): Observable<Empty> { // Decrease rating
    console.log('decreaseRating', data);
    return from(this.restaurantService.DecreaseRating(data.restaurantId));
  }

  deleteRestaurant(data: RestaurantId): Observable<Empty> {
    console.log('deleteRestaurant', data);
    return from(this.restaurantService.deleteRestaurant(data));
  }

  getRestaurantByName(data: NameRequest): Observable<RestaurantResponse> {
    console.log('getRestaurantByName', data);
    return from(this.restaurantService.getRestaurantByName(data));
  }

  getRestaurantsByCuisine(data: CuisineRequest): Observable<RestaurantList> {
    console.log('getRestaurantsByCuisine', data);
    return from(this.restaurantService.getRestaurantsByCuisine(data));
  }

  getRestaurantsByUserId(data: UserIdRequest): Observable<RestaurantList> {
    console.log('getRestaurantsByUserId', data);
    return from(this.restaurantService.getRestaurantsByUserId(data));
  }

  updateIsVerified(data: UpdateIsVerifiedRequest): Observable<RestaurantResponse> {
    console.log('updateIsVerified', data);
    return from(this.restaurantService.updateIsVerified(data));
  }

  updateIsOpen(data: UpdateIsOpenRequest): Observable<RestaurantResponse> {
    console.log('updateIsOpen', data);
    return from(this.restaurantService.updateIsOpen(data));
  }

  getRestaurantsByLocation(data: LocationRequest): Observable<RestaurantList> {
    console.log('getRestaurantsByLocation', data);
    return from(this.restaurantService.getRestaurantsByLocation(data));
  }

  getAllRestaurantsWithFilters(_: Empty): Observable<RestaurantList> {
    return from(this.restaurantService.getAllRestaurantsWithFilters(_));
  }
}
