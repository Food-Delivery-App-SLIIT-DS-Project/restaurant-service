export class CreateRestaurantDto {
  restaurantId: string;
  userId: string;
  restaurantName: string;
  address?: string;
  openingHours?: string;
  cuisineType?: string;
}
