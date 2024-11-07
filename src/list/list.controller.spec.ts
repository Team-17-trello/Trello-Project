import { Test, TestingModule } from '@nestjs/testing';
import { UserEntity } from 'src/user/entities/user.entity';
import { BoardEntity } from '../../src/board/entities/board.entity';
import { CardEntity } from '../card/entities/card.entity';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { ListEntity } from './entities/list.entity';
import { ListController } from './list.controller';
import { ListService } from './list.service';

describe('ListController', () => {
  let listController: ListController;
  let listService: ListService;
  let expectedBoard: BoardEntity;
  let mockUser: UserEntity;

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
    }).compile();

    listController = module.get<ListController>(ListController);
    listService = module.get<ListService>(ListService);
  });

  it('리스트 생성 검증', async () => {
    const createListDto: CreateListDto = {
      boardId: 1,
      name: 'To Do',
    };

    const expectedResult = { id: 1, ...createListDto, mockUser };

    (listService.create as jest.Mock).mockResolvedValue(expectedResult);

    const result = await listController.create(createListDto, mockUser);

    expect(result).toEqual(expectedResult);
    expect(listService.create).toHaveBeenCalledWith(createListDto, mockUser);
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
    const listId: number = 1;
    const updateListDto: UpdateListDto = {
      name: 'Done',
    };

    const expectedCard: CardEntity = {
      id: 1,
      title: 'Test Card',
      description: 'This is a test card',
      color: '#FFFFFF',
      order: 1,
      createdAt: new Date('2022-01-01T00:00:00Z'),
      updatedAt: new Date('2022-01-01T00:00:00Z'),
      dueDate: new Date('2022-12-31T00:00:00Z'),
      list: {} as ListEntity,
      responsibles: [],
      author: 1,
    } as CardEntity;

    const expectedResult: ListEntity = {
      id: 1,
      name: 'Done',
      order: 1,
      userId: 1,
      board: expectedBoard,
      createdAt: new Date('2022-01-01T00:00:00Z'),
      updatedAt: new Date('2022-01-01T00:00:00Z'),
      cards: [expectedCard],
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

  it('리스트 순서 업데이트 검증', async () => {
    const listId = 1;
    const updateListDto: UpdateListDto = {
      name: '리스트 이름이 업데이트 되었습니다.',
    };

    const expectedBoard = new BoardEntity();
    const expectedCard = {
      id: 1,
      title: 'Test Card',
      description: 'This is a test card',
      color: '#FFFFFF',
      order: 1,
      createdAt: new Date('2022-01-01T00:00:00Z'),
      updatedAt: new Date('2022-01-01T00:00:00Z'),
      dueDate: new Date('2022-12-31T00:00:00Z'),
      list: {} as ListEntity,
      responsibles: [],
      author: 1,
    } as CardEntity;

    const expectedResult: ListEntity = {
      id: listId,
      name: updateListDto.name,
      order: 1,
      userId: 1,
      board: expectedBoard,
      createdAt: new Date('2022-01-01T00:00:00Z'),
      updatedAt: new Date('2022-01-01T00:00:00Z'),
      cards: [expectedCard],
    };

    (listService.updateOrder as jest.Mock).mockResolvedValue(expectedResult);

    const result = await listController.updateOrder(listId, updateListDto);

    expect(result).toEqual(expectedResult);
    expect(listService.updateOrder).toHaveBeenCalledWith(listId, updateListDto);
  });
});
