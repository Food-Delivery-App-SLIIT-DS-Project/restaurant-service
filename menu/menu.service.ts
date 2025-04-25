import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { nanoid } from 'nanoid';

import { Menu, MenuDocument } from './entities/menu.entity';
import {
  Restaurant,
  RestaurantDocument,
} from '../restaurant/entities/restaurant.entity';

import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';

@Injectable()
export class MenuService {
  constructor(
    @InjectModel(Menu.name)
    private readonly menuModel: Model<MenuDocument>,
    @InjectModel(Restaurant.name)
    private readonly restaurantModel: Model<RestaurantDocument>,
  ) {}

  // Create a new menu
  async create(dto: CreateMenuDto): Promise<Menu> {
    // Check if the restaurant exists
    const restaurant = await this.restaurantModel.findOne({
      restaurantId: dto.restaurantId,
    });
    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }

    const menuId = 'menue' + nanoid(10);
    const createdMenu = new this.menuModel({ ...dto, menuId });
    return createdMenu.save();
  }
  // Fetch all menus
  async findAll(): Promise<Menu[]> {
    return this.menuModel.find().lean().exec();
  }

  // Fetch all menus with isopen and isverified on resturant
  // Get all menus where the restaurant is verified and open
  async getAllValidMenus(): Promise<Menu[]> {
    // Step 1: Get all verified and open restaurants
    const validRestaurants = await this.restaurantModel
      .find({ isVerified: true, isOpen: true })
      .lean()
      .exec();

    // Step 2: Extract their restaurantIds
    const validRestaurantIds = validRestaurants.map((r) => r.restaurantId);

    // Step 3: Get menus for those restaurantIds
    return this.menuModel
      .find({ restaurantId: { $in: validRestaurantIds } })
      .lean()
      .exec();
  }

  async findOne(menuId: string): Promise<Menu | null> {
    return this.menuModel.findOne({ menuId }).lean().exec();
  }

  async update(menuId: string, dto: UpdateMenuDto): Promise<Menu | null> {
    return this.menuModel
      .findOneAndUpdate({ menuId }, dto, { new: true })
      .lean()
      .exec();
  }

  //menue availablity update
  async updateMenuAvailability(
    menuId: string,
    available: boolean,
  ): Promise<Menu | null> {
    return this.menuModel
      .findOneAndUpdate({ menuId }, { available }, { new: true })
      .lean()
      .exec();
  }

  async delete(menuId: string): Promise<void> {
    await this.menuModel.findOneAndDelete({ menuId }).exec();
  }

  async findByName(name: string): Promise<Menu[]> {
    return this.menuModel.find({ name }).lean().exec();
  }

  async findByRestaurantId(restaurantId: string): Promise<Menu[]> {
    return this.menuModel.find({ restaurantId }).lean().exec();
  }
}
