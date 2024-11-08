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

    // 이름이 중복된 체크리스트가 있는지 확인
    const foundCreateChecklistName = await this.checklistRepository.findOne({
      where: { checklistName },
    });
    
    // ConflictException: 이름이 중복되면 예외를 발생
    if (foundCreateChecklistName) {
      throw new ConflictException(`해당 체크리스트의 이름 "${checklistName}"이 이미 존재합니다.`);
    }

    // 카드 엔티티의 기본 형태를 정의하고 체크리스트를 생성
    const card = { id: cardId } as CardEntity;
    const checklist = this.checklistRepository.create({
      card,
      checklistName,
    });

    // 생성된 체크리스트를 저장
    await this.checklistRepository.save(checklist);

    console.log(checklist); // 확인용

    return checklist;
  }

  // 체크리스트 업데이트
  async updateChecklist(
    checklistId: number,
    updateChecklistDto: UpdateChecklistDto,
  ): Promise<ChecklistEntity> {
    const checklist = await this.checklistRepository.findOne({
      where: { id: checklistId },
    });

    // NotFoundException: 체크리스트가 없으면 예외를 발생
    if (!checklist) {
      throw new NotFoundException('해당하는 체크리스트가 없습니다.');
    }

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
    const checklist = await this.checklistRepository.findOne({
      where: { id: checklistId },
    });

    // NotFoundException: 체크리스트가 없으면 예외를 발생
    if (!checklist) {
      throw new NotFoundException('해당하는 체크리스트가 없습니다.');
    }

    // 체크리스트 삭제
    await this.checklistRepository.delete({
      id: checklistId,
    });

    // 삭제 성공 메시지 반환
    return { message: '체크리스트가 삭제 되었습니다.' };
  }
}
