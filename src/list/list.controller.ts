import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { ListService } from './list.service';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';

@Controller('lists')
export class ListController {
  constructor(private readonly listService: ListService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createListDto: CreateListDto) {
    return this.listService.create(createListDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.listService.findAll();
  }

  @Get(':listId')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('listId') listId: number) {
    return this.listService.findOne(listId);
  }

  @Patch(':listId')
  @HttpCode(HttpStatus.OK)
  update(@Param('listId') listId: number, @Body() updateListDto: UpdateListDto) {
    return this.listService.update(listId, updateListDto);
  }

  @Delete(':listId')
  @HttpCode(HttpStatus.OK)
  remove(@Param('listId') listId: number) {
    return this.listService.remove(listId);
  }
}
