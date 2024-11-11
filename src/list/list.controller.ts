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
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserInfo } from 'src/utils/userInfo-decolator';
import { MemberGuard } from '../guard/members.guard';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { UpdateOrderListDto } from './dto/update-order-list.dto';
import { ListService } from './list.service';

@ApiBearerAuth()
@ApiTags('리스트')
@Controller('lists')
@UseGuards(MemberGuard)
export class ListController {
  constructor(private readonly listService: ListService) {}

  @Post()
  @ApiOperation({ summary: '리스트 생성' })
  @ApiResponse({
    status: 201,
    description: '리스트가 성공적으로 생성되었습니다',
    type: CreateListDto,
  })
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createListDto: CreateListDto, @UserInfo() user: UserEntity) {
    return this.listService.create(createListDto, user);
  }

  @Get('/inventory/:boardId')
  @ApiOperation({ summary: '리스트 목록 조회' })
  @ApiResponse({ status: 200, description: '리스트가 성공적으로 조회되었습니다.' })
  @HttpCode(HttpStatus.OK)
  findAll(@Param('boardId', ParseIntPipe) boardId: number) {
    return this.listService.findAll(boardId);
  }

  @Get(':listId')
  @ApiOperation({ summary: '리스트 목록 상세 조회' })
  @ApiResponse({ status: 200, description: '리스트가 성공적으로 조회되었습니다.' })
  @HttpCode(HttpStatus.OK)
  findOne(@Param('listId', ParseIntPipe) listId: number) {
    return this.listService.findOne(listId);
  }

  @Put(':listId')
  @ApiOperation({ summary: '리스트 목록 수정' })
  @ApiResponse({
    status: 200,
    description: '리스트가 성공적으로 수정되었습니다.',
    type: UpdateListDto,
  })
  @HttpCode(HttpStatus.OK)
  update(@Param('listId', ParseIntPipe) listId: number, @Body() updateListDto: UpdateListDto) {
    return this.listService.update(listId, updateListDto);
  }

  @Put('orders/:boardId')
  @ApiOperation({ summary: '리스트 순서 수정' })
  @ApiResponse({
    status: 200,
    description: '리스트 순서가 성공적으로 수정되었습니다.',
    type: UpdateOrderListDto,
  })
  @HttpCode(HttpStatus.OK)
  updateOrder(
    @Param('boardId', ParseIntPipe) boardId: number,
    @Body() updateOrderListDto: UpdateOrderListDto,
  ) {
    return this.listService.updateOrder(boardId, updateOrderListDto);
  }

  @Delete(':listId')
  @ApiOperation({ summary: '리스트 삭제' })
  @ApiResponse({ status: 200, description: '리스트가 성공적으로 삭제되었습니다.' })
  @HttpCode(HttpStatus.OK)
  remove(@Param('listId', ParseIntPipe) listId: number) {
    return this.listService.remove(listId);
  }
}
