import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { ChecklistService } from './checklist.service';
import { CreateChecklistDto } from './dto/create-checklist.dto';
import { UpdateChecklistDto } from './dto/update-checklist.dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('checklists')
export class ChecklistController {
  constructor(private readonly checklistService: ChecklistService) {}

  // @Post()
  // create(@Body() createChecklistDto: CreateChecklistDto) {
  //   return this.checklistService.createCheklist(createChecklistDto);
  // }

  // @Get()
  // findAll() {
  //   return this.checklistService.findAllChecklist();
  // }

  // @Put(':id')
  // update(@Param('id') id: string, @Body() updateChecklistDto: UpdateChecklistDto) {
  //   return this.checklistService.updateChecklist(+id, updateChecklistDto);
  // }

  // @Delete('')
  // remove(@Param('id') id: string) {
  //   return this.checklistService.removeChecklist(+id);
  // }
}
