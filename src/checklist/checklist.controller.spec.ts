import { Test, TestingModule } from '@nestjs/testing';
import { MemberGuard } from 'src/guard/members.guard';
import { ChecklistController } from './checklist.controller';
import { ChecklistService } from './checklist.service';
import { CreateChecklistDto } from './dto/create-checklist.dto';
import { UpdateChecklistDto } from './dto/update-checklist.dto';
import { ChecklistEntity } from './entities/checklist.entity';

describe('체크리스트 컨트롤러 테스트', () => {
  let checklistController: ChecklistController;
  let checklistService: ChecklistService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChecklistController],
      providers: [
        {
          provide: ChecklistService,
          useValue: {
            createChecklist: jest.fn(),
            findAll: jest.fn(),
            updateChecklist: jest.fn(),
            removeChecklist: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(MemberGuard)
      .useValue({})
      .compile();

    checklistController = module.get<ChecklistController>(ChecklistController);
    checklistService = module.get<ChecklistService>(ChecklistService);
  });

  it('체크리스트 컨트롤러 생성 테스트', async () => {
    const createChecklistDto: CreateChecklistDto = {
      cardId: 1,
      checklistName: 'test',
    };
    const expectedResult: ChecklistEntity = {
      id: 1,
      checklistName: 'test',
      createdAt: new Date(),
      card: null,
      items: null,
    };
    (checklistService.createChecklist as jest.Mock).mockResolvedValue(expectedResult);
    const result = await checklistController.create(createChecklistDto);
    expect(result).toEqual(expectedResult);
    expect(checklistService.createChecklist).toHaveBeenCalledWith(createChecklistDto);
  });

  it('체크리스트 컨트롤러 수정 테스트', async () => {
    const checklistId = 1;
    const updateChecklistDto: UpdateChecklistDto = { checklistName: 'test' };
    const expectedResult: ChecklistEntity = {
      id: 1,
      checklistName: 'test',
      createdAt: new Date(),
      card: null,
      items: null,
    };
    (checklistService.updateChecklist as jest.Mock).mockResolvedValue(expectedResult);

    const result = await checklistController.update(checklistId, updateChecklistDto);

    expect(result).toEqual(expectedResult);
    expect(checklistService.updateChecklist).toHaveBeenCalledWith(checklistId, updateChecklistDto);
  });
  it('체크리스트 컨트롤러 삭제 테스트', async () => {
    const checklistId = 1;
    const expectedResult = { message: '체크리스트가 삭제 되었습니다.' };

    (checklistService.removeChecklist as jest.Mock).mockResolvedValue(expectedResult);
    const result = await checklistController.remove(checklistId);
    expect(result).toEqual(expectedResult);
    expect(checklistService.removeChecklist).toHaveBeenCalledWith(checklistId);
  });
});
