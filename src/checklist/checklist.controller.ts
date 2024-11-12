import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MemberGuard } from '../guard/members.guard';
import { ChecklistService } from './checklist.service';
import { CreateChecklistDto } from './dto/create-checklist.dto';
import { UpdateChecklistDto } from './dto/update-checklist.dto';

@ApiBearerAuth()
@ApiTags('체크리스트')
@UseGuards(MemberGuard)
@Controller('checklists')
export class ChecklistController {
  constructor(private readonly checklistService: ChecklistService) {}

  @Post()
  @ApiOperation({ summary: '체크리스트 생성' })
  @ApiResponse({
    status: 201,
    description: '체크리스트가 성공적으로 생성되었습니다.',
    type: CreateChecklistDto,
  })
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createChecklistDto: CreateChecklistDto) {
    return this.checklistService.createChecklist(createChecklistDto);
  }

  @Put(':checklistId')
  @ApiOperation({ summary: '체크리스트 수정' })
  @ApiResponse({
    status: 200,
    description: '체크리스트가 성공적으로 수정되었습니다.',
    type: UpdateChecklistDto,
  })
  @HttpCode(HttpStatus.OK)
  update(
    @Param('checklistId') checklistId: number,
    @Body() updateChecklistDto: UpdateChecklistDto,
  ) {
    return this.checklistService.updateChecklist(checklistId, updateChecklistDto);
  }

  @Delete(':checklistId')
  @ApiOperation({ summary: '체크리스트 삭제' })
  @ApiResponse({
    status: 200,
    description: '체크리스트가 성공적으로 삭제되었습니다.',
  })
  @HttpCode(HttpStatus.OK)
  remove(@Param('checklistId') checklistId: number) {
    return this.checklistService.removeChecklist(checklistId);
  }
}
