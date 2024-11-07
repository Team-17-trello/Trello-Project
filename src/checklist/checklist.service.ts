import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateChecklistDto } from './dto/create-checklist.dto';
import { UpdateChecklistDto } from './dto/update-checklist.dto';
import { Repository } from 'typeorm';
import { ChecklistEntity } from './entities/checklist.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CardEntity } from 'src/card/entities/card.entity';

@Injectable()
export class ChecklistService {
  constructor(
    @InjectRepository(ChecklistEntity)
    private readonly checklistRepositorty: Repository<ChecklistEntity>,
  ) {}

  async createCheklist(createChecklistDto: CreateChecklistDto): Promise<ChecklistEntity> {
    const { cardId, checklistName } = createChecklistDto;

    const foundCreateChecklistName = this.checklistRepositorty.findOne({
      where: { checklistName },
    });
    if (!foundCreateChecklistName) {
      throw new ConflictException(`해당 체크리스트의 이름${checklistName}이 이미 존재합니다.`);
    }

    const card = { id: cardId };
    const cheklist = this.checklistRepositorty.create({
      card,
      checklistName,
    });

    await this.checklistRepositorty.save(cheklist);

    console.log(cheklist); // 확인용

    return cheklist;
  }

  async updateChecklist(
    checklistId: number,
    updateChecklistDto: UpdateChecklistDto,
  ): Promise<ChecklistEntity> {
    const checklist = await this.checklistRepositorty.findOne({
      // 어디: { 확인목록 번호 },
      where: { id: checklistId },
    });
    if (!checklist) {
      // 쓰로우 뉴 에러 {메시지}
      throw new NotFoundException('해당하는 체크리스트가 없습니다.');
    }

    const updateData: Partial<ChecklistEntity> = {};
    if (updateChecklistDto.checklistName) {
      updateData.checklistName = updateChecklistDto.checklistName;
    }
    await this.checklistRepositorty.update(checklistId, updateData);

    return this.checklistRepositorty.findOne({
      where: { id: checklistId },
    });
  }

  async removeChecklist(checklistId: number) {
    return { message: '체크리스트가 삭제 되었습니다.' };
  }
}
