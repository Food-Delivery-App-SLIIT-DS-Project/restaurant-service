import { Controller, NotFoundException } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { MenuService } from './menu.service';
import { Menu } from './entities/menu.entity';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';

@Controller()
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  // gRPC CreateMenu method
  @GrpcMethod('MenuService', 'CreateMenu')
  async createMenu(dto: CreateMenuDto): Promise<Menu> {
    console.log('[CreateMenu] Request DTO:', dto);
    const created = await this.menuService.create(dto);
    console.log('[CreateMenu] Created Menu:', created);
    return created;
  }

  // gRPC GetMenuById method
  @GrpcMethod('MenuService', 'GetMenuById')
  async getMenuById(data: { id: string }): Promise<Menu> {
    console.log('[GetMenuById] Requested ID:', data.id);
    const menu = await this.menuService.findOne(data.id);
    if (!menu) {
      console.error('[GetMenuById] Menu not found for ID:', data.id);
      throw new NotFoundException(`Menu with id ${data.id} not found`);
    }
    console.log('[GetMenuById] Found Menu:', menu);
    return menu;
  }

  // gRPC GetMenusByRestaurantId method
  @GrpcMethod('MenuService', 'GetMenusByRestaurantId')
  async getMenusByRestaurantId(data: {
    restaurantId: string;
  }): Promise<{ menus: Menu[] }> {
    console.log('[GetMenusByRestaurantId] Restaurant ID:', data.restaurantId);
    const menus = await this.menuService.findByRestaurantId(data.restaurantId);
    console.log('[GetMenusByRestaurantId] Menus:', menus);
    return { menus }; // ✅ return wrapped object
  }

  // gRPC GetMenusByName method
  @GrpcMethod('MenuService', 'GetMenusByName')
  async getMenusByName(data: { name: string }): Promise<{ menus: Menu[] }> {
    console.log('[GetMenusByName] Requested Name:', data.name);
    const menus = await this.menuService.findByName(data.name);
    console.log('[GetMenusByName] Found Menus:', menus);
    return { menus }; // ✅ return wrapped object
  }

  // gRPC UpdateMenu method
  @GrpcMethod('MenuService', 'UpdateMenu')
  async updateMenu(data: { id: string; dto: UpdateMenuDto }): Promise<Menu> {
    console.log('[UpdateMenu] ID:', data.id, 'DTO:', data.dto);
    const updatedMenu = await this.menuService.update(data.id, data.dto);
    if (!updatedMenu) {
      console.error('[UpdateMenu] Menu not found for ID:', data.id);
      throw new NotFoundException(`Menu with id ${data.id} not found`);
    }
    console.log('[UpdateMenu] Updated Menu:', updatedMenu);
    return updatedMenu;
  }

  // gRPC UpdateMenuStatus method
  @GrpcMethod('MenuService', 'UpdateMenuStatus')
  async updateMenuStatus(data: {
    id: string;
    available: boolean;
  }): Promise<Menu> {
    console.log(
      '[UpdateMenuStatus] ID:',
      data.id,
      'Available:',
      data.available,
    );
    const updatedMenu = await this.menuService.updateMenuAvailability(
      data.id,
      data.available,
    );
    if (!updatedMenu) {
      console.error('[UpdateMenuStatus] Menu not found for ID:', data.id);
      throw new NotFoundException(`Menu with id ${data.id} not found`);
    }
    console.log('[UpdateMenuStatus] Updated Menu:', updatedMenu);
    return updatedMenu;
  }

  // gRPC DeleteMenu method
  @GrpcMethod('MenuService', 'DeleteMenu')
  async deleteMenu(data: { id: string }): Promise<void> {
    console.log('[DeleteMenu] Deleting Menu ID:', data.id);
    await this.menuService.delete(data.id);
    console.log('[DeleteMenu] Deleted successfully');
  }

  // gRPC GetAllMenus method
  @GrpcMethod('MenuService', 'GetAllMenus')
  async getAllMenus(): Promise<{ menus: Menu[] }> {
    console.log('[GetAllMenus] Fetching all menus...');
    const menus = await this.menuService.findAll();
    console.log('[GetAllMenus] Menus:', menus);
    return { menus };
  }
  // gRPC GetAllValidMenus method
  @GrpcMethod('MenuService', 'GetAllValidMenus')
  async getAllValidMenus(): Promise<{ menus: Menu[] }> {
    console.log('[GetAllValidMenus] Fetching all valid menus...');
    const menus = await this.menuService.getAllValidMenus();
    console.log('[GetAllValidMenus] Valid Menus:', menus);
    return { menus };
  }
}
