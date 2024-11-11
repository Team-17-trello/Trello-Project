import { Test, TestingModule } from '@nestjs/testing';
import { MemberGuard } from 'src/guard/members.guard';
import { UserEntity } from 'src/user/entities/user.entity';
import { BoardEntity } from '../../src/board/entities/board.entity';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { UpdateOrderListDto } from './dto/update-order-list.dto';
import { ListEntity } from './entities/list.entity';
import { ListController } from './list.controller';
import { ListService } from './list.service';

describe('ListController', () => {
  let listController: ListController;
  let listService: ListService;
  let expectedBoard: BoardEntity;
  let user: UserEntity;

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
            updateOrder: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(MemberGuard)
      .useValue({})
      .compile();

    listController = module.get<ListController>(ListController);
    listService = module.get<ListService>(ListService);
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
      userId: 1,
      board: expectedBoard,
      createdAt: new Date('2022-01-01T00:00:00Z'),
      updatedAt: new Date('2022-01-01T00:00:00Z'),
      cards: [],
    };

    (listService.create as jest.Mock).mockResolvedValue(expectedResult);

    const result = await listController.create(createListDto, user);

    expect(listService.create).toHaveBeenCalledWith(createListDto, user);
    expect(result).toEqual(expectedResult);
  });
  it('리스트 전체 조회 검증', async () => {
    const expectedResult = [
      { id: 1, name: 'To Do', board: expectedBoard, order: 1 },
      { id: 2, name: 'In Progress', board: expectedBoard, order: 2 },
    ];

    (listService.findAll as jest.Mock).mockResolvedValue(expectedResult);
    const result = await listController.findAll(1);
    expect(result).toEqual(expectedResult);
    expect(listService.findAll).toHaveBeenCalledWith(1);
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
    const boardId = 1;
    const updateListDto: UpdateListDto = { name: 'Update List Name' };
    const expectedResult = {
      id: boardId,
      name: updateListDto.name,
      order: 2,
      userId: 1,
      createdAt: new Date('2022-01-01T00:00:00Z'),
      updatedAt: new Date('2022-01-02T00:00:00Z'),
      cards: [],
    } as ListEntity;

    (listService.update as jest.Mock).mockResolvedValue(expectedResult);

    const result = await listController.update(boardId, updateListDto);

    expect(result).toEqual(expectedResult);
    expect(listService.update).toHaveBeenCalledWith(boardId, updateListDto);
  });

  it('리스트 삭제 검증', async () => {
    const listId = 1;
    const expectedResult = { message: '리스트가 성공적으로 삭제되었습니다.' };

    (listService.remove as jest.Mock).mockResolvedValue(expectedResult);

    const result = await listController.remove(listId);
    expect(result).toEqual(expectedResult);
    expect(listService.remove).toHaveBeenCalledWith(listId);
  });

  it('리스트 순서 업데이트 검증', async () => {
    const boardId = 1;
    const updateOrderListDto: UpdateOrderListDto = {
      order: 1,
    };

    const expectedBoard = new BoardEntity();

    const expectedResult: ListEntity = {
      id: boardId,
      name: '이름',
      order: 1,
      userId: 1,
      board: expectedBoard,
      createdAt: new Date('2022-01-01T00:00:00Z'),
      updatedAt: new Date('2022-01-01T00:00:00Z'),
      cards: [],
    };

    (listService.updateOrder as jest.Mock).mockResolvedValue(expectedResult);

    const result = await listController.updateOrder(boardId, updateOrderListDto);

    expect(result).toEqual(expectedResult);
    expect(listService.updateOrder).toHaveBeenCalledWith(boardId, updateOrderListDto);
  });
});
