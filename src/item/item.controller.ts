import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ItemService } from './item.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { MemberGuard } from '../guard/members.guard';

@UseGuards(MemberGuard)
@Controller('items')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Post()
  create(@Body() createItemDto: CreateItemDto) {
    return this.itemService.create(createItemDto);
  }

  @Patch(':itemId')
  update(@Param('itemId') itemId: string, @Body() updateItemDto: UpdateItemDto) {
    return this.itemService.update(+itemId, updateItemDto);
  }

  @Delete(':itemId')
  remove(@Param('itemId') itemId: string) {
    return this.itemService.remove(+itemId);
  }
}
