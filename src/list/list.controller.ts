import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserInfo } from 'src/utils/userInfo-decolator';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { ListService } from './list.service';

@Controller('lists')
@UseGuards(AuthGuard('jwt'))
export class ListController {
  constructor(private readonly listService: ListService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createListDto: CreateListDto, @UserInfo() user: UserEntity) {
    return this.listService.create(createListDto, user);
  }

  @Get('/inventory/:boardId')
  @HttpCode(HttpStatus.OK)
  findAll(@Param('boardId', ParseIntPipe) boardId: number) {
    return this.listService.findAll(boardId);
  }

  @Get(':listId')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('listId', ParseIntPipe) listId: number) {
    return this.listService.findOne(listId);
  }

  @Put(':listId')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('listId', ParseIntPipe) listId: number,
    @Body() updateListDto: UpdateListDto,
    @UserInfo() user: UserEntity,
  ) {
    return this.listService.update(listId, updateListDto, user);
  }

  @Delete(':listId')
  @HttpCode(HttpStatus.OK)
  remove(@Param('listId', ParseIntPipe) listId: number, @UserInfo() user: UserEntity) {
    return this.listService.remove(listId, user);
  }
}
