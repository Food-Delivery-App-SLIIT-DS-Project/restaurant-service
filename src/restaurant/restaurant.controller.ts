/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Controller } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';

import { from, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { RpcException } from '@nestjs/microservices';

import {
  CreateRestaurantRequest,
  CuisineRequest,
  Empty,
  LocationRequest,
  NameRequest,
  OrderAcceptedResponse,
  RatingIncrease,
  RestaurantId,
  RestaurantList,
  RestaurantResponse,
  RestaurantServiceController,
  RestaurantServiceControllerMethods,
  UpdateIsOpenRequest,
  UpdateIsVerifiedRequest,
  UpdateRestaurantRequest,
  UserIdRequest,
} from 'src/types/restaurant';

@RestaurantServiceControllerMethods()
@Controller()
export class RestaurantController implements RestaurantServiceController {
  constructor(private readonly restaurantService: RestaurantService) {}

  private handleError(error: unknown) {
    console.error('gRPC Error:', error);
    return new RpcException(
      error instanceof Error ? error.message : 'Internal server error',
    );
  }

  createRestaurant(request: CreateRestaurantRequest) {
    return this.wrap(() => this.restaurantService.createRestaurant(request));
  }

  getRestaurant(request: RestaurantId) {
    return this.wrap(() => this.restaurantService.getRestaurant(request));
  }

  getAllRestaurants() {
    console.log('getAllRestaurants controller--');
    return this.wrap(() => this.restaurantService.getAllRestaurants());
  }

  updateRestaurant(request: UpdateRestaurantRequest) {
    return this.wrap(() => this.restaurantService.updateRestaurant(request));
  }

  deleteRestaurant(request: RestaurantId) {
    return this.wrap(() => this.restaurantService.deleteRestaurant(request));
  }

  getRestaurantByName(request: NameRequest) {
    return this.wrap(() => this.restaurantService.getRestaurantByName(request));
  }

  getRestaurantsByCuisine(request: CuisineRequest) {
    return this.wrap(() =>
      this.restaurantService.getRestaurantsByCuisine(request),
    );
  }

  getRestaurantsByUserId(request: UserIdRequest) {
    return this.wrap(() =>
      this.restaurantService.getRestaurantsByUserId(request),
    );
  }

  updateIsVerified(request: UpdateIsVerifiedRequest) {
    return this.wrap(() => this.restaurantService.updateIsVerified(request));
  }

  updateIsOpen(request: UpdateIsOpenRequest) {
    return this.wrap(() => this.restaurantService.updateIsOpen(request));
  }

  getRestaurantsByLocation(request: LocationRequest) {
    return this.wrap(() =>
      this.restaurantService.getRestaurantsByLocation(request),
    );
  }

  getAllRestaurantsWithFilters() {
    return this.wrap(() =>
      this.restaurantService.getAllRestaurantsWithFilters(),
    );
  }

  updateRating(request: RatingIncrease) {
    return this.wrap(() =>
      this.restaurantService.UpdateRating(request.restaurantId),
    );
  }

  decreaseRating(request: RestaurantId) {
    return this.wrap(() =>
      this.restaurantService.DecreaseRating(request.restaurantId),
    );
  }

  restaurantOrderAcceptOrReject(
    request: any,
  ): Observable<OrderAcceptedResponse> | Promise<OrderAcceptedResponse> {
    // eslint-disable-next-line @typescript-eslint/require-await
    return this.wrap(async () =>
      this.restaurantService.restaurantOrderAcceptOrReject(request),
    );
  }

  // Wrap service methods and handle errors
  private wrap<T>(
    fn: () => Promise<T> | Observable<T>,
  ): Promise<T> | Observable<T> {
    try {
      const result = fn();

      if (result instanceof Observable) {
        return result.pipe(
          catchError((err) => {
            throw this.handleError(err);
          }),
        );
      }

      return result.catch((err) => {
        throw this.handleError(err);
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }
}
