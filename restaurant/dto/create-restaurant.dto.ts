import {
  IsString,
  IsOptional,
  IsBoolean,
  ValidateNested,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

class CoordinatesDto {
  @IsNumber()
  longitude: number;

  @IsNumber()
  latitude: number;
}

export class CreateRestaurantDto {
  @IsString()
  userId: string;

  @IsString()
  restaurantId: string;

  @IsString()
  name: string;

  @IsString()
  address: string;

  @ValidateNested()
  @Type(() => CoordinatesDto)
  location: CoordinatesDto;

  @IsString()
  phone: string;

  @IsString()
  cuisineType: string;

  @IsString()
  description: string;

  @IsString()
  openHours: string;

  @IsOptional()
  @IsString()
  imageReference?: string;

  @IsOptional()
  @IsNumber()
  numberOfRatings?: number;

  @IsOptional()
  @IsBoolean()
  isOpen?: boolean;

  @IsOptional()
  @IsBoolean()
  isVerified?: boolean;
}
