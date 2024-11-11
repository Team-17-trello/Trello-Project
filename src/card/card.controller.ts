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
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MemberGuard } from '../guard/members.guard';
import { UserEntity } from '../user/entities/user.entity';
import { UserInfo } from '../utils/userInfo-decolator';
import { CardService } from './card.service';
import { CreateCardDto } from './dto/create-card.dto';
import { DueDateDto } from './dto/duedate.dto';
import { MoveCardDto } from './dto/move-card.dto';
import { ResponsibleDto } from './dto/responsible.dto';
import { UpdateCardDto } from './dto/update-card.dto';

@ApiBearerAuth()
@ApiTags('카드')
@UseGuards(MemberGuard)
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
  @Get(':cardId')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('cardId') cardId: string) {
    return this.cardService.findOne(+cardId);
  }

  @ApiOperation({ summary: '카드 수정' })
  @ApiResponse({
    status: 200,
    description: '카드를 성공적으로 수정하였습니다.',
    type: UpdateCardDto,
  })
  @Patch(':cardId')
  @HttpCode(HttpStatus.OK)
  update(@Param('cardId') cardId: string, @Body() updateCardDto: UpdateCardDto) {
    return this.cardService.update(+cardId, updateCardDto);
  }

  @ApiOperation({ summary: '마감일 설정' })
  @ApiResponse({ status: 200, description: '카드 마감일을 성공적으로 설정함', type: DueDateDto })
  @Patch('date/:cardId')
  @HttpCode(HttpStatus.OK)
  setDueDate(@Param('cardId') cardId: string, @Body() dueDateDto: DueDateDto) {
    return this.cardService.setDueDate(+cardId, dueDateDto);
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
  @Delete(':cardId')
  @HttpCode(HttpStatus.OK)
  remove(@Param('cardId') cardId: string) {
    return this.cardService.remove(+cardId);
  }

  @ApiOperation({ summary: '카드 순서변경' })
  @ApiResponse({ status: 200, description: '카드순서가 성공적으로 변경됨', type: MoveCardDto })
  @Patch(':cardId/move')
  @HttpCode(HttpStatus.OK)
  moveCard(@Param('cardId') cardId: string, @Body() moveCardDto: MoveCardDto) {
    return this.cardService.moveCard(+cardId, moveCardDto);
  }
}
