import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Menu {
  @Prop({ required: true, unique: true })
  menuId: string;

  @Prop({ required: true })
  restaurantId: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop({ default: 'No Image' })
  imageUrl: string;

  @Prop({ default: true })
  available: boolean;
}

export type MenuDocument = Menu & Document;
export const MenuSchema = SchemaFactory.createForClass(Menu);
