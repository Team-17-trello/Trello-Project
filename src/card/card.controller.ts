import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { CardService } from './card.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { DueDateDto } from './dto/deadline.dto';
import {ResponsibleDto} from './dto/responsible.dto';
import { UserInfo } from '../utils/userInfo-decolator';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../user/entities/user.entity';

@UseGuards(AuthGuard('jwt'))
@Controller('cards')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @Post()
  create(@UserInfo() user : User, @Body() createCardDto: CreateCardDto) {
    return this.cardService.create(user, createCardDto);
  }

  @Get(':listId')
  findAll(@Param() listId : string) {
    return this.cardService.findAll(+listId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cardService.findOne(+id);
  }

  @Patch(':id')
  update(@UserInfo() user:User,@Param('id') id: string, @Body() updateCardDto: UpdateCardDto) {
    return this.cardService.update(+id, updateCardDto);
  }

  @Patch('date')
  setDueDate(@UserInfo() user:User, @Param('id') id: string, @Body() dueDateDto : DueDateDto){
    return this.cardService.setDueDate(+id, dueDateDto)
  }

  @Post('/:cardId/responsible')
  inviteResponsible(@UserInfo() @Param('cardId') cardId: string, @Body() responsibleDto: ResponsibleDto){
    return this.cardService.inviteResponsible(+cardId, responsibleDto)
  }


  @Delete('/:cardId/responsible/:id')
  removeResponsible(@UserInfo()  @Param('cardId') cardId: string, @Param('id') id: string,){
    return this.cardService.removeResponsible(+cardId, +id)
  }

  @Delete(':id')
  remove(@UserInfo()  @Param('id') id: string) {
    return this.cardService.remove(+id);
  }
}
