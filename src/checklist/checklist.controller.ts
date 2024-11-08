import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ChecklistService } from './checklist.service';
import { CreateChecklistDto } from './dto/create-checklist.dto';
import { UpdateChecklistDto } from './dto/update-checklist.dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('checklists')
export class ChecklistController {
  constructor(private readonly checklistService: ChecklistService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createChecklistDto: CreateChecklistDto) {
    return this.checklistService.createChecklist(createChecklistDto);
  }

  @Put(':checklistId')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('checklistId') checklistId: number,
    @Body() updateChecklistDto: UpdateChecklistDto,
  ) {
    return this.checklistService.updateChecklist(checklistId, updateChecklistDto);
  }

  @Delete(':checklistId')
  @HttpCode(HttpStatus.OK)
  remove(@Param('checklistId') checklistId: number) {
    return this.checklistService.removeChecklist(checklistId);
  }
}
