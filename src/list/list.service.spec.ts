import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ListEntity } from './entities/list.entity';
import { ListService } from './list.service';
import { CreateBoardDto } from 'src/board/dto/create-board.dto';
import { CreateListDto } from './dto/create-list.dto';
import { mock } from 'node:test';
import { BoardEntity } from 'src/board/entities/board.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import exp from 'constants';
import { User } from 'src/user/entities/user.entity';

describe('ListService', () => {
  let listService: ListService;
  let listRepository: Repository<ListEntity>;
  let boardRepository: Repository<BoardEntity>;

  const mockUser: User = {
    id: 1,
    email: 'email@test.com',
    password: 'password',
    nickname: 'nickname',
  } as User;

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

  it('리스트 생성 검증', async () => {
    const createListDto = { boardId: 1, name: 'To Do' };
    const mockBoard = { id: 1, name: 'Sample Board' } as BoardEntity;
    const mockList = { id: 1, name: 'To Do', order: 1, userId: 1, board: mockBoard } as ListEntity;

    mockBoardRepository.findOne.mockResolvedValue(mockBoard);
    mockListRepository.count.mockResolvedValue(0);
    mockListRepository.create.mockReturnValue(mockList);
    mockListRepository.save.mockResolvedValue(mockList);

    const result = await listService.create(createListDto, mockUser);

    expect(result).toEqual(mockList);
    expect(boardRepository.findOne).toHaveBeenCalledWith({ where: { id: createListDto.boardId } });
    expect(listRepository.create).toHaveBeenCalledWith({
      ...createListDto,
      order: 1,
      userId: 1,
      board: mockBoard,
    });
    expect(listRepository.save).toHaveBeenCalledWith(mockList);
  });

  it('리스트 생성시 해당하는 보드 아이디가 있는지 확인 검증', async () => {
    const createListDto = { boardId: 1, name: 'Sample List' };
    mockBoardRepository.findOne.mockResolvedValue(null);

    await expect(listService.findOne(1)).rejects.toThrow(NotFoundException);
  });

  it('리스트 목록 조회 검증', async () => {
    const boardId = 1;
    const expectedResult = [
      { id: 1, name: 'To Do', order: 1, board: { id: boardId } } as ListEntity,
    ];

    mockListRepository.find.mockResolvedValue(expectedResult);

    const result = await listService.findAll(boardId);
    expect(result).toEqual(expectedResult);
    expect(listRepository.find).toHaveBeenCalledWith({ where: { board: { id: boardId } } });
  });

  it('리스트 목록이 하나도 없을 경우 검증', async () => {
    const boardId = 1;
    const list = [];

    mockListRepository.find.mockResolvedValue(list);

    await expect(listService.findAll(boardId)).rejects.toThrow(BadRequestException);
  });

  it('리스트 상세 목록 조회 검증', async () => {
    const listId = 1;
    const expectedResult = { id: listId, name: 'To Do', order: 1, board: null } as ListEntity;

    mockListRepository.findOne.mockResolvedValue(expectedResult);

    const result = await listService.findOne(listId);
    expect(result).toEqual(expectedResult);
    expect(listRepository.findOne).toHaveBeenCalledWith({ where: { id: listId } });
  });

  it('리스트 목록이 없는 경우 검증', async () => {
    mockListRepository.findOne.mockResolvedValue(null);

    await expect(listService.findOne(1)).rejects.toThrow(NotFoundException);
  });

  it('리스트 이름 수정 검증', async () => {
    const listId = 1;
    const updateListDto = { name: 'Done' };
    const updatedList = { id: listId, name: 'Done', order: 1, board: null } as ListEntity;

    jest.spyOn(listService, 'verifyListByBoardId').mockResolvedValue(undefined);

    mockListRepository.update.mockResolvedValue(updatedList);
    mockListRepository.findOne.mockResolvedValue(updatedList);

    const result = await listService.update(listId, updateListDto, mockUser);

    expect(result).toEqual(updatedList);
    expect(listRepository.update).toHaveBeenCalledWith({ id: listId }, updateListDto);
    expect(listRepository.findOne).toHaveBeenCalledWith({ where: { id: listId } });
    // expect(result.name).toBe(updateListDto.name);
    // expect(result.updatedAt).toBeDefined();
  });

  it('리스트 순서 수정 검증', async () => {});

  it('리스트 삭제 검증', async () => {
    const listId = 1;
    const expectedResult = { message: '리스트가 성공적으로 삭제되었습니다.' };

    jest.spyOn(listService, 'verifyListByBoardId').mockResolvedValue(undefined);

    mockListRepository.delete.mockResolvedValue(expectedResult);

    const result = await listService.remove(listId, mockUser);

    expect(listService.verifyListByBoardId).toHaveBeenCalledWith(mockUser.id, listId);
    expect(listRepository.delete).toHaveBeenCalledWith({ id: listId });
    expect(result).toEqual({ message: '리스트가 성공적으로 삭제되었습니다.' });
  });

  it('삭제할 리스트가 없을 경우 검증', async () => {
    const listId = 1;

    mockListRepository.delete.mockResolvedValue({ affected: 0 });
    await expect(listService.remove(listId, mockUser)).rejects.toThrow(NotFoundException);
    expect(mockListRepository.delete).not.toHaveBeenCalledWith({ id: listId });
  });
});
