import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
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

@UseGuards(AuthGuard('jwt'))
@Controller('cards')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @Post()
  create(@UserInfo() user: UserEntity, @Body() createCardDto: CreateCardDto) {
    return this.cardService.create(user, createCardDto);
  }

  @Get(':listId')
  findAll(@Param() listId: string) {
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

  @Patch('date')
  setDueDate(@Param('id') id: string, @Body() dueDateDto: DueDateDto) {
    return this.cardService.setDueDate(+id, dueDateDto);
  }

  @Post('/:cardId/responsible')
  inviteResponsible(@Param('cardId') cardId: string, @Body() responsibleDto: ResponsibleDto) {
    return this.cardService.inviteResponsible(+cardId, responsibleDto);
  }

  @Delete('/:cardId/responsible/:id')
  removeResponsible(@Param('cardId') cardId: string, @Param('id') id: string) {
    return this.cardService.removeResponsible(+cardId, +id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cardService.remove(+id);
  }

  @Patch(':id/move')
  moveCard(@Param('id') id: string, moveCardDto: MoveCardDto) {
    return this.cardService.moveCard(+id, moveCardDto);
  }
}
