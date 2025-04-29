/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable prettier/prettier */
import { Controller } from '@nestjs/common';
import { MenuService } from './menu.service';
import {
  CreateMenuRequest,
  Empty,
  Menu,
  MenuId,
  MenuList,
  MenuServiceController,
  MenuServiceControllerMethods,
  NameRequest,
  RestaurantId,
  UpdateMenuRequest,
  UpdateMenuStatusRequest,
} from 'src/types/menu';
import { Observable } from 'rxjs';

@MenuServiceControllerMethods()
@Controller()
export class MenuController implements MenuServiceController {
  constructor(private readonly menuService: MenuService) {}

  createMenu(
    request: CreateMenuRequest,
  ): Promise<Menu> | Observable<Menu> | Menu {
    return this.menuService.create(request);
  }
  getMenuById(request: MenuId): Promise<Menu> | Observable<Menu> | Menu {
    return this.menuService.findOne(request.menuId).then((menu) => {
      if (!menu) {
        throw new Error('Menu not found');
      }
      return menu;
    });
  }
  getMenusByRestaurantId(
    request: RestaurantId,
  ): Promise<MenuList> | Observable<MenuList> | MenuList {
    return this.menuService
      .getMenusByRestaurantId(request.restaurantId)
      .then((menus) => ({ menus }));
  }

  getMenusByName(
    request: NameRequest,
  ): MenuList | Promise<MenuList> | Observable<MenuList> {
    return this.menuService.findByName(request.name).then((menus) => {
      return { menus };
    });
  }

  updateMenu(
    request: UpdateMenuRequest,
  ): Promise<Menu> | Observable<Menu> | Menu {
    return this.menuService.update(request).then((menu) => {
      if (!menu) {
        throw new Error('Menu not found');
      }
      return menu;
    });
  }
  updateMenuStatus(
    request: UpdateMenuStatusRequest,
  ): Promise<Menu> | Observable<Menu> | Menu {
    return this.menuService
      .updateMenuAvailability(request.menuId, request.available)
      .then((menu) => {
        if (!menu) {
          throw new Error('Menu not found');
        }
        return menu;
      });
  }

  deleteMenu(request: MenuId): Promise<Empty> | Observable<Empty> | Empty {
    return this.menuService.delete(request.menuId);
  }
  getAllMenus(): Promise<MenuList> | Observable<MenuList> | MenuList {
    return this.menuService.getAllMenus().then((menus) => ({ menus }));
  }
  getAllValidMenus(): Promise<MenuList> | Observable<MenuList> | MenuList {
    return this.menuService.getAllValidMenus().then((menus) => ({ menus }));
  }
}
