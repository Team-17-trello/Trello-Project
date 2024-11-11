import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MemberGuard } from '../guard/members.guard';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { ItemService } from './item.service';

@UseGuards(MemberGuard)
@ApiBearerAuth()
@ApiTags('체크 리스트 아이템')
@Controller('items')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Post()
  @ApiOperation({ summary: '체크 리스트 아이템 생성' })
  @ApiResponse({
    status: 201,
    description: '체크 리스트 아이템을 성공적으로 생성되었습니다.',
    type: CreateItemDto,
  })
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createItemDto: CreateItemDto) {
    return this.itemService.create(createItemDto);
  }

  @Patch(':itemId')
  @ApiOperation({ summary: '체크 리스트 아이템 수정' })
  @ApiResponse({
    status: 200,
    description: '체크 리스트 아이템을 성공적으로 수정되었습니다.',
    type: UpdateItemDto,
  })
  @HttpCode(HttpStatus.OK)
  update(@Param('itemId') itemId: string, @Body() updateItemDto: UpdateItemDto) {
    return this.itemService.update(+itemId, updateItemDto);
  }

  @Delete(':itemId')
  @ApiOperation({ summary: '체크 리스트 아이템 삭제' })
  @ApiResponse({
    status: 200,
    description: '체크 리스트 아이템을 성공적으로 삭제되었습니다.',
  })
  @HttpCode(HttpStatus.OK)
  remove(@Param('itemId') itemId: string) {
    return this.itemService.remove(+itemId);
  }
}
