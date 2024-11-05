import { Test, TestingModule } from '@nestjs/testing';
import { ListController } from './list.controller';
import { ListService } from './list.service';
import { CreateListDto } from './dto/create-list.dto';
import { ListEntity } from './entities/list.entity';
import { UpdateListDto } from './dto/update-list.dto';
import { BoardEntity } from '../../src/board/entities/board.entity';

describe('ListController', () => {
  let listController: ListController;
  let listService: ListService;
  let expectedBoard: BoardEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ListController],
      providers: [
        {
          provide: ListService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    listController = module.get<ListController>(ListController);
    listService = module.get<ListService>(ListService);

    expectedBoard = {
      id: 1,
      name: 'Sample Board',
      description: 'A sample board',
      backgroundColor: '#FFFFFF',
      userId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      lists: [],
    };
  });

  it('리스트 생성 검증', async () => {
    const createListDto: CreateListDto = {
      boardId: 1,
      name: 'To Do',
    };

    const expectedResult: ListEntity = {
      id: 1,
      name: 'To do',
      order: 1,
      board: expectedBoard,
      createdAt: new Date('2022-01-01T00:00:00Z'),
      updatedAt: new Date('2022-01-01T00:00:00Z'),
    };

    (listService.create as jest.Mock).mockResolvedValue(expectedResult);

    const result = await listController.create(createListDto);

    expect(result).toEqual(expectedResult);
    expect(listService.create).toHaveBeenCalledWith(createListDto);
  });
  it('리스트 전체 조회 검증', async () => {
    const expectedResult = [
      { id: 1, name: 'To Do', board: expectedBoard, order: 1 },
      { id: 2, name: 'In Progress', board: expectedBoard, order: 2 },
    ];

    (listService.findAll as jest.Mock).mockResolvedValue(expectedResult);
    const result = await listController.findAll();
    expect(result).toEqual(expectedResult);
    expect(listService.findAll).toHaveBeenCalled();
  });
  it('리스트 상세 조회 검증', async () => {
    const listId = 1;

    const expectedResult = {
      id: 1,
      name: 'To Do',
      board: expectedBoard,
      order: 1,
      createdAt: new Date('2022-01-01T00:00:00Z'),
      updatedAt: new Date('2022-01-01T00:00:00Z'),
    };

    (listService.findOne as jest.Mock).mockResolvedValue(expectedResult);

    const result = await listController.findOne(listId);
    expect(result).toEqual(expectedResult);
    expect(listService.findOne).toHaveBeenCalledWith(listId);
  });
  it('리스트 수정 검증', async () => {
    const listId = 1;
    const updateListDto: UpdateListDto = {
      name: 'Done',
    };

    const expectedResult: ListEntity = {
      id: 1,
      name: 'Done',
      order: 1,
      board: expectedBoard,
      createdAt: new Date('2022-01-01T00:00:00Z'),
      updatedAt: new Date('2022-01-01T00:00:00Z'),
    };

    (listService.update as jest.Mock).mockResolvedValue(expectedResult);

    const result = await listController.update(listId, updateListDto);

    expect(result).toEqual(expectedResult);
    expect(listService.update).toHaveBeenCalledWith(listId, updateListDto);
  });

  it('리스트 삭제 검증', async () => {
    const listId = 1;
    const expectedResult = { message: '리스트가 성공적으로 삭제되었습니다.' };

    (listService.remove as jest.Mock).mockResolvedValue(expectedResult);

    const result = await listController.remove(listId);
    expect(result).toEqual(expectedResult);
    expect(listService.remove).toHaveBeenCalledWith(listId);
  });
});
