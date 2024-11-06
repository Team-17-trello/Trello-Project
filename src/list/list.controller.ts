import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { ListService } from './list.service';

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
  findOne(@Query('listId') listId: number) {
    return this.listService.findOne(listId);
  }

  @Patch(':listId')
  @HttpCode(HttpStatus.OK)
  update(@Query('listId') listId: number, @Body() updateListDto: UpdateListDto) {
    return this.listService.update(listId, updateListDto);
  }

  @Delete(':listId')
  @HttpCode(HttpStatus.OK)
  remove(@Query('listId') listId: number) {
    return this.listService.remove(listId);
  }
}
