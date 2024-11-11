import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CardEntity } from 'src/card/entities/card.entity';
import { Repository } from 'typeorm';
import { ChecklistService } from './checklist.service';
import { ChecklistEntity } from './entities/checklist.entity';

describe('ChecklistService', () => {
  let service: ChecklistService;
  let checklistRepository: Repository<ChecklistEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChecklistService,
        {
          provide: getRepositoryToken(ChecklistEntity),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ChecklistService>(ChecklistService);
    checklistRepository = module.get<Repository<ChecklistEntity>>(
      getRepositoryToken(ChecklistEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('체크리스트 생성하고 생성된 데이터가 리턴되어야 함', async () => {
    const createChecklistDto = {
      cardId: 1,
      checklistName: 'Test Checklist',
    };
    const expectedChecklist: ChecklistEntity = {
      id: 1,
      checklistName: createChecklistDto.checklistName,
      createdAt: new Date('2024-11-07'),
      card: { id: 1 } as CardEntity,
      items: null,
    };

    jest.spyOn(checklistRepository, 'create').mockReturnValue(expectedChecklist);
    jest.spyOn(checklistRepository, 'save').mockResolvedValue(expectedChecklist);

    const result = await service.createChecklist(createChecklistDto);
    expect(result).toEqual(expectedChecklist);
  });

  it('체크리스트 이름이 업데이트 되어야 함', async () => {
    const checklistId = 1;
    const updateChecklistDto = {
      checklistName: 'Updated Checklist',
    };
    const expectedUpdatedChecklist: ChecklistEntity = {
      id: 1,
      checklistName: updateChecklistDto.checklistName,
      createdAt: new Date('2024-11-07'),
      card: { id: 1 } as CardEntity,
      items: null,
    };

    jest.spyOn(checklistRepository, 'findOne').mockResolvedValue(expectedUpdatedChecklist);
    jest.spyOn(checklistRepository, 'update').mockResolvedValue(undefined);
    jest.spyOn(checklistRepository, 'findOne').mockResolvedValue(expectedUpdatedChecklist);

    const result = await service.updateChecklist(checklistId, updateChecklistDto);
    expect(result).toEqual(expectedUpdatedChecklist);
  });

  it('체크리스트가 삭제되어야 함', async () => {
    const checklistId = 1;
    const expectedMessage = { message: '체크리스트가 삭제 되었습니다.' };

    jest.spyOn(checklistRepository, 'findOne').mockResolvedValue({} as ChecklistEntity);
    jest.spyOn(checklistRepository, 'delete').mockResolvedValue(undefined);

    const result = await service.removeChecklist(checklistId);
    expect(result).toEqual(expectedMessage);
  });
});
