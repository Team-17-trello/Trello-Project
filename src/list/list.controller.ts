import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { ListService } from './list.service';
import { AuthGuard } from '@nestjs/passport';
import { UserInfo } from 'src/utils/userInfo-decolator';
import { User } from 'src/user/entities/user.entity';

@Controller('lists')
@UseGuards(AuthGuard('jwt'))
export class ListController {
  constructor(private readonly listService: ListService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createListDto: CreateListDto, @UserInfo() user: User) {
    return this.listService.create(createListDto, user);
  }

  @Get(':boardId')
  @HttpCode(HttpStatus.OK)
  findAll(@Param('boardId', ParseIntPipe) boardId: number) {
    return this.listService.findAll(boardId);
  }

  @Get(':listId')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('listId', ParseIntPipe) listId: number) {
    return this.listService.findOne(listId);
  }

  @Patch(':listId')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('listId', ParseIntPipe) listId: number,
    @Body() updateListDto: UpdateListDto,
    @UserInfo() user: User,
  ) {
    return this.listService.update(listId, updateListDto, user);
  }

  @Delete(':listId')
  @HttpCode(HttpStatus.OK)
  remove(@Param('listId', ParseIntPipe) listId: number, @UserInfo() user: User) {
    return this.listService.remove(listId, user);
  }
}
