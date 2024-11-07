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
  //checklistCreate메서드의 checkListName 넣으면 생성된 체크리스트 반환
  it('체크리스트 생성하고 생성된 데이터가 리턴되어야 함', ()=> {
    const createChecklistDto = {
      "cardId": 1,
      "checklistName": "Test Checklist"
    }
    const { checklistName } = createChecklistDto
    const expectedChecklist = { id:1 , cardId:1, createdAt: '2024-11-07', checklistName: checklistName } //예상 반환 값

    // checklistCreate 메서드를 호출하여 반환된 결과가 예상한 값과 일치하는지 확인
    jest.spyOn(service, 'createCheklist').mockImplementation(() => 'expectedChecklist');

    const result = service.createCheklist(createChecklistDto); //<인자값 뭐 넣을건지

    // 반환된 체크리스트가 예상과 동일한지 확인
    expect(result).toEqual(expectedChecklist);
  })

  //체크리스트 업데이트
  it('체크리스트 이름이 업데이트 되어야함', ()=>{
    const newName = 'newNeam'
    const newExpectedChecklist = {
      id:1,
      cardId:1,
      workspaceId:1,
      createdAt: '2024-11-07',
      checklistName: newName
    }

    jest.spyOn(service, 'updateChecklist').mockImplementation(() => 'newExpectedChecklist')

    const result = service.updateChecklist(newName)

    expect(result).toEqual(newExpectedChecklist)
  })


  //체크리스트 삭제
  it('체크리스트가 삭제 되어야함', ()=>{
    const checklistId = 1
    const ExpectedChecklist = { message: '체크리스트가 삭제 되었습니다.' };

    jest.spyOn(service, 'createCheklist').mockImplementation(() => 'expectedChecklist');

    const result = service.removeChecklist(checklistId)

    expect(result).toEqual(ExpectedChecklist)
  })
});
