import { Injectable } from '@nestjs/common';
import { CreateChecklistDto } from './dto/create-checklist.dto';
import { UpdateChecklistDto } from './dto/update-checklist.dto';

@Injectable()
export class ChecklistService {
  createCheklist(createChecklistDto: CreateChecklistDto) {
    return `This action returns all checklist`;
  }

  updateChecklist(updateChecklistDto: UpdateChecklistDto) {
    return `This action returns a  checklist`;
  }

  removeChecklist(checklistId: number) {
    return `This action updates a #checklist`;
  }
}
