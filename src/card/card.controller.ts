import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CardService } from './card.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { DueDateDto } from './dto/duedate.dto';
import { ResponsibleDto } from './dto/responsible.dto';
import { MoveCardDto } from './dto/move-card.dto';
import { UserInfo } from '../utils/userInfo-decolator';
import { AuthGuard } from '@nestjs/passport';
import { UserEntity } from '../user/entities/user.entity';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('카드')
@UseGuards(AuthGuard('jwt'))
@Controller('cards')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: '카드 생성' })
  @ApiResponse({ status: 201, description: '카드가 성공적으로 생성됨', type: CreateCardDto })
  create(@UserInfo() user: UserEntity, @Body() createCardDto: CreateCardDto) {
    return this.cardService.create(user, createCardDto);
  }

  @ApiOperation({ summary: '카드 목록 조회' })
  @ApiResponse({ status: 200, description: '카드 목록을 성공적으로 조회하였습니다.' })
  @Get('/all/:listId')
  @HttpCode(HttpStatus.OK)
  findAll(@Param('listId') listId: string) {
    return this.cardService.findAll(+listId);
  }

  @ApiOperation({ summary: '카드 상세 조회' })
  @ApiResponse({ status: 200, description: '카드를 성공적으로 조회하였습니다.' })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.cardService.findOne(+id);
  }

  @ApiOperation({ summary: '카드 수정' })
  @ApiResponse({
    status: 200,
    description: '카드를 성공적으로 수정하였습니다.',
    type: UpdateCardDto,
  })
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: string, @Body() updateCardDto: UpdateCardDto) {
    return this.cardService.update(+id, updateCardDto);
  }

  @ApiOperation({ summary: '마감일 설정' })
  @ApiResponse({ status: 200, description: '카드 마감일을 성공적으로 설정함', type: DueDateDto })
  @Patch('date/:id')
  @HttpCode(HttpStatus.OK)
  setDueDate(@Param('id') id: string, @Body() dueDateDto: DueDateDto) {
    return this.cardService.setDueDate(+id, dueDateDto);
  }

  @ApiOperation({ summary: '카드 담당자 초대' })
  @ApiResponse({
    status: 201,
    description: '카드 담당자가 성공적으로 초대됨',
    type: ResponsibleDto,
  })
  @Post(':cardId/responsible')
  @HttpCode(HttpStatus.OK)
  inviteResponsible(@Param('cardId') cardId: string, @Body() responsibleDto: ResponsibleDto) {
    return this.cardService.inviteResponsible(+cardId, responsibleDto);
  }

  @ApiOperation({ summary: '카드 담당자 삭제' })
  @ApiResponse({ status: 200, description: '담당자를 성공적으로 삭제 하였습니다.' })
  @Delete(':cardId/responsible/:responsibleId')
  @HttpCode(HttpStatus.OK)
  removeResponsible(@Param('cardId') cardId: string, @Param('responsibleId') id: string) {
    return this.cardService.removeResponsible(+cardId, +id);
  }

  @ApiOperation({ summary: '카드 삭제' })
  @ApiResponse({ status: 200, description: '카드가 성공적으로 삭제됨' })
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string) {
    return this.cardService.remove(+id);
  }

  @ApiOperation({ summary: '카드 순서변경' })
  @ApiResponse({ status: 200, description: '카드순서가 성공적으로 변경됨', type: MoveCardDto })
  @Patch(':id/move')
  @HttpCode(HttpStatus.OK)
  moveCard(@Param('id') id: string, @Body() moveCardDto: MoveCardDto) {
    return this.cardService.moveCard(+id, moveCardDto);
  }
}
