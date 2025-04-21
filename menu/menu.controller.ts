import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';

@Controller()
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @MessagePattern('createMenu')
  create(@Payload() createMenuDto: CreateMenuDto) {
    return this.menuService.create(createMenuDto);
  }

  @MessagePattern('findAllMenu')
  findAll() {
    return this.menuService.findAll();
  }

  @MessagePattern('findOneMenu')
  findOne(@Payload() id: number) {
    return this.menuService.findOne(id);
  }

  @MessagePattern('updateMenu')
  update(@Payload() updateMenuDto: UpdateMenuDto) {
    return this.menuService.update(updateMenuDto.id, updateMenuDto);
  }

  @MessagePattern('removeMenu')
  remove(@Payload() id: number) {
    return this.menuService.remove(id);
  }
}
