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
    private readonly checklistRepository: Repository<ChecklistEntity>, // 'checklistRepository'로 변수명 수정
  ) {}

  // 체크리스트 생성
  async createChecklist(createChecklistDto: CreateChecklistDto): Promise<ChecklistEntity> {
    const { cardId, checklistName } = createChecklistDto;
    await this.checkDuplicateChecklist(checklistName);
    // 카드 엔티티의 기본 형태를 정의하고 체크리스트를 생성
    const card = { id: cardId } as CardEntity;
    const checklist = this.checklistRepository.create({
      card,
      checklistName,
    });
    // 생성된 체크리스트를 저장
    await this.checklistRepository.save(checklist);
    return checklist;
  }

  // 체크리스트 업데이트
  async updateChecklist(
    checklistId: number,
    updateChecklistDto: UpdateChecklistDto,
  ): Promise<ChecklistEntity> {
    await this.verifychecklist(checklistId);
    // 업데이트할 데이터 준비
    const updateData: Partial<ChecklistEntity> = {};
    if (updateChecklistDto.checklistName) {
      updateData.checklistName = updateChecklistDto.checklistName;
    }
    // 체크리스트 업데이트 실행
    await this.checklistRepository.update(checklistId, updateData);
    // 업데이트된 체크리스트 반환
    return this.checklistRepository.findOne({
      where: { id: checklistId },
    });
  }

  // 체크리스트 삭제
  async removeChecklist(checklistId: number) {
    await this.verifychecklist(checklistId);
    // 체크리스트 삭제
    await this.checklistRepository.delete({
      id: checklistId,
    });
    // 삭제 성공 메시지 반환
    return { message: '체크리스트가 삭제 되었습니다.' };
  }

  // 체크리스트 중복 된 이름 확인 함수
  private async checkDuplicateChecklist(checklistName: string) {
    const foundCreateChecklistName = await this.checklistRepository.findOne({
      where: { checklistName },
    });
    if (foundCreateChecklistName) {
      throw new ConflictException(`해당 체크리스트의 이름 "${checklistName}"이 이미 존재합니다.`);
    }
    return foundCreateChecklistName;
  }

  // 체크리스트 존재 여부 확인
  private async verifychecklist(checklistId: number) {
    const checklist = await this.checklistRepository.findOne({
      where: { id: checklistId },
    });
    if (!checklist) {
      throw new NotFoundException('해당하는 체크리스트가 없습니다.');
    }
  }
}
