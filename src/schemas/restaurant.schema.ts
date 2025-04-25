import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RestaurantDocument = Restaurant & Document;

@Schema()
export class Coordinates {
  @Prop({ required: true })
  longitude: number;

  @Prop({ required: true })
  latitude: number;
}

const CoordinatesSchema = SchemaFactory.createForClass(Coordinates);

@Schema({ timestamps: true }) // Enables createdAt and updatedAt
export class Restaurant {
  @Prop({ required: true }) //user who created it
  userId: string;

  @Prop({ required: true, unique: true }) //restaurant ID
  restaurantId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  address: string;

  @Prop({ type: CoordinatesSchema, required: true })
  location: Coordinates;

  @Prop({ required: true, unique: true }) // Unique phone number
  phone: string;

  @Prop({ required: true })
  cuisineType: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true }) // New: Open hours string
  openHours: string;

  @Prop({ default: 'noImage' })
  imageReference: string;

  @Prop({ default: 0 })
  numberOfRatings: number;

  @Prop({ default: false })
  isOpen: boolean;

  @Prop({ default: false })
  isVerified: boolean;
}

export const RestaurantSchema = SchemaFactory.createForClass(Restaurant);

// Optional: Add a 2dsphere index for geospatial queries
// RestaurantSchema.index({ location: '2dsphere' });
