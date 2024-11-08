import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
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
  @ApiOperation({ summary: '카드 생성' })
  @ApiResponse({ status: 201, description: '카드가 성공적으로 생성됨', type: CreateCardDto })
  create(@UserInfo() user: UserEntity, @Body() createCardDto: CreateCardDto) {
    return this.cardService.create(user, createCardDto);
  }

  @Get('/all/:listId')
  findAll(@Param('listId') listId: string) {
    return this.cardService.findAll(+listId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cardService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCardDto: UpdateCardDto) {
    return this.cardService.update(+id, updateCardDto);
  }

  @Patch('date/:id')
  setDueDate(@Param('id') id: string, @Body() dueDateDto: DueDateDto) {
    return this.cardService.setDueDate(+id, dueDateDto);
  }

  @Post(':cardId/responsible')
  inviteResponsible(@Param('cardId') cardId: string, @Body() responsibleDto: ResponsibleDto) {
    return this.cardService.inviteResponsible(+cardId, responsibleDto);
  }

  @Delete(':cardId/responsible/:responsibleId')
  removeResponsible(@Param('cardId') cardId: string, @Param('responsibleId') id: string) {
    return this.cardService.removeResponsible(+cardId, +id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cardService.remove(+id);
  }

  @Patch(':id/move')
  moveCard(@Param('id') id: string, @Body() moveCardDto: MoveCardDto) {
    return this.cardService.moveCard(+id, moveCardDto);
  }
}
