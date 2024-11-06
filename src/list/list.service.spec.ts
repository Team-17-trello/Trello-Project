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

const mockListRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};
const mockBoardRepository = {
  findOne: jest.fn(),
};

describe('ListService', () => {
  let listService: ListService;
  let listRepository: Repository<ListEntity>;

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
          useValue: mockListRepository,
        },
      ],
    }).compile();

    listService = module.get<ListService>(ListService);
    listRepository = module.get<Repository<ListEntity>>(getRepositoryToken(ListEntity));
  });

  it('should be defined', () => {
    expect(listService).toBeDefined();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('리스트 생성 성공 검증', async () => {
    const createListDto = {
      id: 1,
      name: 'list',
      boardId: 1,
    };

    mockListRepository.create.mockResolvedValue(createListDto);
    mockListRepository.save.mockResolvedValue({
      id: 1,
      ...createListDto,
    });

    const result = await listService.create(createListDto);

    expect(mockListRepository.create).toHaveBeenCalledWith(createListDto);
    expect(mockListRepository.save).toHaveBeenCalledWith(createListDto);
    expect(result).toEqual({
      id: 1,
      ...createListDto,
    });
  });

  it('리스트 생성시 해당하는 보드 아이디가 있는지 확인 검증', async () => {
    mockBoardRepository.findOne.mockResolvedValue(null);

    await expect(listService.findOne(1)).rejects.toThrow(NotFoundException);
  });

  it('리스트 목록 조회 검증', async () => {
    const lists = [
      {
        id: 1,
        name: 'name',
        order: 1,
        createdAt: new Date('2022-01-01T00:00:00Z'),
      },
      {
        id: 2,
        name: 'name2',
        order: 2,
        createdAt: new Date('2022-01-01T00:00:00Z'),
      },
    ];

    mockListRepository.find.mockResolvedValue(lists);

    const result = await listService.findAll();

    expect(mockListRepository.find).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ result });
  });

  it('리스트 목록이 하나도 없을 경우 검증', async () => {
    const list = [];

    mockListRepository.find.mockResolvedValue(list);

    await expect(listService.findAll()).rejects.toThrow(BadRequestException);
  });

  it('리스트 상세 목록 조회 검증', async () => {
    const list = {
      id: 1,
      name: 'name',
      order: 1,
      createdAt: new Date('2022-01-01T00:00:00Z'),
      board: {
        id: 1,
        name: 'board',
        description: 'description',
      },
    };

    mockListRepository.findOne.mockResolvedValue(list);
    const result = await listService.findOne(1);

    expect(mockListRepository.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
    });
    expect(result).toEqual(list);
  });

  it('리스트 목록이 없는 경우 검증', async () => {
    mockListRepository.findOne.mockResolvedValue(null);

    await expect(listService.findOne(1)).rejects.toThrow(NotFoundException);
  });

  it('리스트 이름 수정 검증', async () => {
    const updateListDto = {
      name: 'name2',
    };

    const list = {
      id: 1,
      name: 'name',
      order: 1,
      createdAt: new Date('2022-01-01T00:00:00Z'),
      updatedAt: new Date('2022-01-01T00:00:00Z'),
    };

    const updatedList = { ...list, name: updateListDto.name, updatedAt: new Date() };

    mockListRepository.findOne.mockResolvedValue(list);
    mockListRepository.update.mockResolvedValue(updatedList);

    const result = await listService.update(list.id, updateListDto);

    expect(mockListRepository.findOne).toHaveBeenCalledWith(list.id);
    expect(mockListRepository.update).toHaveBeenCalledWith(list.id, { name: updateListDto.name });
    // expect(result.name).toBe(updateListDto.name);
    // expect(result.updatedAt).toBeDefined();
  });

  it('리스트 순서 수정 검증', async () => {});

  it('리스트 삭제 검증', async () => {
    mockListRepository.delete.mockResolvedValue({ affected: 1 });
    const result = await listService.remove(1);

    expect(mockListRepository.delete).toHaveBeenCalledWith(1);
    expect(result).toEqual({ message: '리스트가 성공적으로 삭제되었습니다.' });
  });

  it('삭제할 리스트가 없을 경우 검증', async () => {
    mockListRepository.delete.mockResolvedValue({ affected: 0 });
    await expect(listService.remove(1)).rejects.toThrow(NotFoundException);
  });
});
