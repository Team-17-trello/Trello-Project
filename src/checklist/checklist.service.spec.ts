import { Test, TestingModule } from '@nestjs/testing';
import { ChecklistService } from './checklist.service';

describe('ChecklistService', () => {
  let service: ChecklistService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChecklistService],
    }).compile();

    service = module.get<ChecklistService>(ChecklistService);
  });


  it('should be defined', () => {
    expect(service).toBeDefined(); //<- 서비스가 존재하는지 검증
  });

  //체크리스트 생성
  //checklistCreate
});
