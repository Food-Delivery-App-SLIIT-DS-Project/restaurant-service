/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/await-thenable */
/* eslint-disable prettier/prettier */

import { Controller } from '@nestjs/common';
import { from, Observable } from 'rxjs';
import { MenuService } from './menu.service';
import {
  MenuServiceController,
  MenuServiceControllerMethods,
  CreateMenuRequest,
  Menu,
  MenuId,
  RestaurantId,
  MenuList,
  NameRequest,
  UpdateMenuRequest,
  UpdateMenuStatusRequest,
  Empty,
} from '../proto/menu';

@MenuServiceControllerMethods()
@Controller()
export class MenuController implements MenuServiceController {
  constructor(private readonly menuService: MenuService) {}

  createMenu(data: CreateMenuRequest): Observable<Menu> {
    console.log('createMenu', data);
    return from(this.menuService.create(data));
  }

  getAllMenus(_: Empty): Observable<MenuList> {
    return from(this.menuService.findAll().then((menus) => ({ menus })));
  }

  getAllValidMenus(_: Empty): Observable<MenuList> {
    return from(this.menuService.getAllValidMenus().then((menus) => ({ menus })));
  }

  getMenuById(data: MenuId): Observable<Menu> {
    return from(this.menuService.findOne(data.menuId).then(menu => menu as Menu));
  }

  getMenusByRestaurantId(data: RestaurantId): Observable<MenuList> {
    return from(
      this.menuService.findByRestaurantId(data.restaurantId).then((menus) => ({
        menus,
      }))
    );
  }

  getMenusByName(data: NameRequest): Observable<MenuList> {
    return from(
      this.menuService.findByName(data.name).then((menus) => ({
        menus,
      }))
    );
  }

  updateMenu(data: UpdateMenuRequest): Observable<Menu> {
    return from(this.menuService.update(data.menuId, data).then(menu => menu as Menu));
  }

  updateMenuStatus(data: UpdateMenuStatusRequest): Observable<Menu> {
    return from(this.menuService.updateMenuAvailability(data.menuId, data.available).then(menu => menu as Menu));
  }

  deleteMenu(data: MenuId): Observable<Empty> {
    return from(
      this.menuService.delete(data.menuId).then(() => ({}))
    );
  }
}
