import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BoardEntity } from 'src/board/entities/board.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateOrderListDto } from './dto/update-order-list.dto';
import { ListEntity } from './entities/list.entity';
import { ListService } from './list.service';

describe('ListService', () => {
  let listService: ListService;
  let listRepository: Repository<ListEntity>;
  let boardRepository: Repository<BoardEntity>;

  const mockUser: UserEntity = {
    id: 1,
    email: 'email@test.com',
    password: 'password',
    nickname: 'nickname',
  } as UserEntity;

  const mockListRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  };
  const mockBoardRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ListService,
        {
          provide: getRepositoryToken(ListEntity),
          useValue: mockListRepository,
        },
        {
          provide: getRepositoryToken(BoardEntity),
          useValue: mockBoardRepository,
        },
      ],
    }).compile();

    listService = module.get<ListService>(ListService);
    listRepository = module.get<Repository<ListEntity>>(getRepositoryToken(ListEntity));
    boardRepository = module.get<Repository<BoardEntity>>(getRepositoryToken(BoardEntity));
  });

  it('should be defined', () => {
    expect(listService).toBeDefined();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('create', () => {
    it('리스트 생성시 전에 리스트가 존재하지 않을 경우 검증', async () => {
      const createListDto = { boardId: 1, name: 'To Do' } as CreateListDto;
      const mockBoard = { id: 1, name: 'Sample Board' } as BoardEntity;
      const mockList = {
        id: 1,
        name: 'To Do',
        order: 1,
        userId: 1,
        board: mockBoard,
      } as ListEntity;

      mockBoardRepository.findOne.mockResolvedValue(mockBoard);
      mockListRepository.findOne.mockResolvedValue(null);
      mockListRepository.save.mockResolvedValue(mockList);

      const result = await listService.create(createListDto, mockUser);

      expect(mockBoardRepository.findOne).toHaveBeenCalledWith({
        where: { id: createListDto.boardId },
      });
      expect(mockListRepository.findOne).toHaveBeenCalledWith({
        where: { board: { id: createListDto.boardId } },
        order: { order: 'DESC' },
      });
      expect(mockListRepository.save).toHaveBeenCalledWith(expect.objectContaining({ order: 1 }));
      expect(result).toEqual(mockList);
    });

    it('리스트 생성시 전에 리스트가 존재 할 경우 검증', async () => {
      const createListDto = { boardId: 1, name: 'To Do' } as CreateListDto;
      const mockBoard = { id: 1, name: 'Sample Board' } as BoardEntity;
      const mockLastOrderList = { order: 2 };
      const mockList = {
        id: 1,
        name: 'To Do',
        order: 1,
        userId: 1,
        board: mockBoard,
      } as ListEntity;

      mockBoardRepository.findOne.mockResolvedValue(mockBoard);
      mockListRepository.findOne.mockResolvedValue(mockLastOrderList);
      mockListRepository.create.mockReturnValue(mockList);
      mockListRepository.save.mockResolvedValue(mockList);

      const result = await listService.create(createListDto, mockUser);

      expect(result).toEqual(mockList);
      expect(mockBoardRepository.findOne).toHaveBeenCalledWith({
        where: { id: createListDto.boardId },
      });
      expect(listRepository.findOne).toHaveBeenCalledWith({
        where: { board: { id: createListDto.boardId } },
        order: { order: 'DESC' },
      });
      expect(listRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({ order: mockLastOrderList.order + 1 }),
      );
      expect(listRepository.save).toHaveBeenCalledWith(mockList);
    });

    it('리스트 생성시 해당하는 보드 아이디가 있는지 확인 검증', async () => {
      const createListDto = { boardId: 1 } as CreateListDto;

      mockBoardRepository.findOne.mockResolvedValue(null);

      await expect(listService.create(createListDto, mockUser)).rejects.toThrow(
        new NotFoundException('해당 보드를 찾을수없습니다.'),
      );

      expect(mockBoardRepository.findOne).toHaveBeenCalledWith({
        where: { id: createListDto.boardId },
      });
    });
  });

  describe('findAll', () => {
    it('리스트 목록 조회 검증', async () => {
      const boardId = 1;
      const expectedResult = [
        { id: 1, name: 'To Do', order: 1, board: { id: boardId } } as ListEntity,
      ];

      mockListRepository.find.mockResolvedValue(expectedResult);

      const result = await listService.findAll(boardId);
      expect(result).toEqual(expectedResult);
      expect(listRepository.find).toHaveBeenCalledWith({
        where: { board: { id: boardId } },
        order: { order: 'ASC' },
      });
    });

    it('리스트 목록이 하나도 없을 경우 검증', async () => {
      const boardId = 1;
      const list = [];

      mockListRepository.find.mockResolvedValue(list);

      await expect(listService.findAll(boardId)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findOne', () => {
    it('리스트 상세 목록 조회 검증', async () => {
      const listId = 1;
      const expectedResult = { id: listId, name: 'To Do', order: 1, board: null } as ListEntity;

      mockListRepository.findOne.mockResolvedValue(expectedResult);

      const result = await listService.findOne(listId);
      expect(result).toEqual(expectedResult);
      expect(listRepository.findOne).toHaveBeenCalledWith({
        where: { id: listId },
        relations: { cards: true },
      });
    });

    it('리스트 목록이 없는 경우 검증', async () => {
      mockListRepository.findOne.mockResolvedValue(null);

      await expect(listService.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    const mockAllOrderList: Array<Pick<ListEntity, 'order'>> = [
      { order: 1 },
      { order: 2 },
      { order: 3 },
    ];
    it('리스트 이름 수정 검증', async () => {
      const listId = 1;
      const updateListDto = { name: 'Done' };
      const updatedList = { id: listId, name: 'Done', order: 1, board: null } as ListEntity;

      mockListRepository.update.mockResolvedValue(updatedList);
      mockListRepository.findOne.mockResolvedValue(updatedList);

      const result = await listService.update(listId, updateListDto);

      expect(result).toEqual(updatedList);
      expect(listRepository.update).toHaveBeenCalledWith({ id: listId }, updateListDto);
      expect(listRepository.findOne).toHaveBeenCalledWith({ where: { id: listId } });
    });

    it('리스트 순서를 첫 번째로 변경하는 경우', async () => {
      const boardId = 1;
      const listId = 1;
      const updateOrderListDto: UpdateOrderListDto = { listId, order: 1 };
      const expectedOrder = mockAllOrderList[0].order / 2;

      mockListRepository.find.mockResolvedValue(mockAllOrderList);
      mockListRepository.update.mockResolvedValue(undefined);
      mockListRepository.findOne.mockResolvedValue({
        id: listId,
        order: expectedOrder,
      } as ListEntity);

      const result = await listService.updateOrder(boardId, updateOrderListDto);

      expect(mockListRepository.update).toHaveBeenCalledWith(
        { id: updateOrderListDto.listId },
        { order: expectedOrder },
      );
      expect(result!.order).toBe(expectedOrder);
    });

    it('리스트 순서를 마지막으로 변경하는 경우', async () => {
      const boardId = 1;
      const listId = 2;
      const updateOrderListDto: UpdateOrderListDto = { listId, order: 4 };
      const expectedOrder = mockAllOrderList[mockAllOrderList.length - 1].order + 1;

      mockListRepository.find.mockResolvedValue(mockAllOrderList);
      mockListRepository.update.mockResolvedValue(undefined);
      mockListRepository.findOne.mockResolvedValue({
        id: listId,
        order: expectedOrder,
      } as ListEntity);

      const result = await listService.updateOrder(boardId, updateOrderListDto);

      expect(mockListRepository.update).toHaveBeenCalledWith(
        { id: updateOrderListDto.listId },
        { order: expectedOrder },
      );
      expect(result!.order).toBe(expectedOrder);
    });

    it('리스트 순서를 중간으로 변경하는 경우', async () => {
      const boardId = 1;
      const listId = 3;
      const updateOrderListDto: UpdateOrderListDto = { listId, order: 2 };

      const list = { id: listId, order: 2 } as ListEntity;
      const targetOrder = mockAllOrderList[updateOrderListDto.order - 1].order;
      const preTargetOrder = mockAllOrderList[updateOrderListDto.order - 2].order;
      const expectedOrder = (targetOrder + preTargetOrder) / 2;

      mockListRepository.findOne.mockResolvedValue(list);
      mockListRepository.find.mockResolvedValue(mockAllOrderList);
      mockListRepository.update.mockResolvedValue({
        id: listId,
        order: expectedOrder,
      });

      const result = await listService.updateOrder(boardId, updateOrderListDto);

      expect(mockListRepository.update).toHaveBeenCalledWith(
        { id: updateOrderListDto.listId },
        { order: expectedOrder },
      );

      expect(result!.order).toBe(expectedOrder);
    });
  });

  describe('remove', () => {
    it('리스트 삭제 검증', async () => {
      const listId = 1;
      const expectedResult = { message: '리스트가 성공적으로 삭제되었습니다.' };

      mockListRepository.delete.mockResolvedValue(expectedResult);

      const result = await listService.remove(listId);

      expect(listRepository.delete).toHaveBeenCalledWith({ id: listId });
      expect(result).toEqual({ message: '리스트가 성공적으로 삭제되었습니다.' });
    });

    it('삭제할 리스트가 없을 경우 검증', async () => {
      const listId = 1;

      mockListRepository.delete.mockResolvedValue({ affected: 0 });
      await expect(listService.remove(listId)).rejects.toThrow(NotFoundException);
      expect(mockListRepository.delete).toHaveBeenCalledWith({ id: listId });
    });
  });
});
