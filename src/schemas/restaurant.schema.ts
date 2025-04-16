import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RestaurantDocument = Restaurant & Document;

@Schema({ timestamps: true })
export class Restaurant {
  @Prop()
  userId: string;

  @Prop()
  restaurantId: string;

  @Prop()
  restaurantName: string;

  @Prop()
  address: string;

  @Prop()
  openingHours: string;

  @Prop()
  cuisineType: string;

  // Optional: You can explicitly declare createdAt and updatedAt if you want
  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const RestaurantSchema = SchemaFactory.createForClass(Restaurant);
