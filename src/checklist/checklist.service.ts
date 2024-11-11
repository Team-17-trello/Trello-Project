import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CardEntity } from 'src/card/entities/card.entity';
import { Repository } from 'typeorm';
import { CreateChecklistDto } from './dto/create-checklist.dto';
import { UpdateChecklistDto } from './dto/update-checklist.dto';
import { ChecklistEntity } from './entities/checklist.entity';

@Injectable()
export class ChecklistService {
  constructor(
    @InjectRepository(ChecklistEntity)
    private readonly checklistRepository: Repository<ChecklistEntity>,
  ) {}

  async createChecklist(createChecklistDto: CreateChecklistDto): Promise<ChecklistEntity> {
    const { cardId, checklistName } = createChecklistDto;
    await this.checkDuplicateChecklist(checklistName);
    const card = { id: cardId } as CardEntity;
    const checklist = this.checklistRepository.create({
      card,
      checklistName,
    });
    try {
      await this.checklistRepository.save(checklist);
      return checklist;
    } catch (err) {
      throw err;
    }
  }

  async updateChecklist(
    checklistId: number,
    updateChecklistDto: UpdateChecklistDto,
  ): Promise<ChecklistEntity> {
    await this.verifychecklist(checklistId);
    try {
      const updateData: Partial<ChecklistEntity> = {};
      if (updateChecklistDto.checklistName) {
        updateData.checklistName = updateChecklistDto.checklistName;
      }
      await this.checklistRepository.update(checklistId, updateData);
      return this.checklistRepository.findOne({
        where: { id: checklistId },
      });
    } catch (err) {
      throw err;
    }
  }

  async removeChecklist(checklistId: number) {
    try {
      await this.verifychecklist(checklistId);
      await this.checklistRepository.delete({
        id: checklistId,
      });
      return { message: '체크리스트가 삭제 되었습니다.' };
    } catch (err) {
      throw err;
    }
  }

  private async checkDuplicateChecklist(checklistName: string) {
    const foundCreateChecklistName = await this.checklistRepository.findOne({
      where: { checklistName },
    });
    if (foundCreateChecklistName) {
      throw new ConflictException(`해당 체크리스트의 이름 "${checklistName}"이 이미 존재합니다.`);
    }
    return foundCreateChecklistName;
  }

  private async verifychecklist(checklistId: number) {
    const checklist = await this.checklistRepository.findOne({
      where: { id: checklistId },
    });
    if (!checklist) {
      throw new NotFoundException('해당하는 체크리스트가 없습니다.');
    }
  }
}
