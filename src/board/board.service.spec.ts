import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BoardService } from './board.service';
import { BoardEntity } from './entities/board.entity';

const mockBoardRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('BoardService', () => {
  let service: BoardService;
  let repository: Repository<BoardEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BoardService,
        {
          provide: getRepositoryToken(BoardEntity),
          useValue: mockBoardRepository,
        },
      ],
    }).compile();

    service = module.get<BoardService>(BoardService);
    repository = module.get<Repository<BoardEntity>>(getRepositoryToken(BoardEntity));
  });

  it('정의되어야 합니다', () => {
    expect(service).toBeDefined();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('보드를 생성하고 저장해야합니다. ', async () => {
      const createBoardDto = {
        name: 'Test Board',
        description: 'Test Description',
        workspaceId: 1,
      };

      mockBoardRepository.create.mockReturnValue(createBoardDto);
      mockBoardRepository.save.mockResolvedValue({
        id: 1,
        ...createBoardDto,
      });

      const data = await service.create(createBoardDto);

      expect(mockBoardRepository.create).toHaveBeenCalledWith(createBoardDto);
      expect(mockBoardRepository.save).toHaveBeenCalledWith(createBoardDto);
      expect(data).toEqual({
        id: 1,
        ...createBoardDto,
      });
    });
  });

  describe('findAll', () => {
    it('모든 보드를 조회해야 합니다.', async () => {
      const boards = [
        {
          id: 1,
          workspaceId: 1,
          name: 'Board 1',
          backgroundColor: '#FFFFFF',
          description: 'Test Description',
        },
      ];
      mockBoardRepository.find.mockResolvedValue(boards);

      const data = await service.findAll();

      expect(mockBoardRepository.find).toHaveBeenCalledTimes(1);
      expect(data).toEqual({ boards });
    });
  });

  describe('findOne', () => {
    it('올바른 ID로 보드를 조회해야합니다.', async () => {
      const board = {
        id: 1,
        workspaceId: 1,
        name: 'Board 1',
        backgroundColor: '#FFFFFF',
        description: 'Test Description',
        // lists: [
        //   {
        //     id: 1,
        //     name: 'List 1',
        //     order: 1,
        //     cards: [
        //       {
        //         id: 1,
        //         name: 'Card 1',
        //         description: 'Card Description',
        //         order: 1,
        //         dueDate: new Date(),
        //       },
        //     ],
        //   },
        // ],
      };

      mockBoardRepository.findOne.mockResolvedValue(board);

      const data = await service.findOne(1);

      expect(mockBoardRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        // relations: {
        //   lists: {
        //     cards: true,
        //   },
        // },
      });
      expect(data).toEqual(board);
    });
  });

  it('보드를 찾을 수 없으면 예외가 발생해야 합니다.', async () => {
    mockBoardRepository.findOne.mockResolvedValue(null);

    await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
  });

  describe('update', () => {
    it('올바른 ID의 보드를 업데이트 해야합니다..', async () => {
      const updateBoardDto = {
        name: 'Updated Board',
        backgroundColor: '#AAAAA',
        description: 'Updated Description',
      };
      const board = {
        id: 1,
        workspaceId: 1,
        name: 'Board 1',
        backgroundColor: '#FFFFFF',
        description: 'Test Description',
      };
      mockBoardRepository.findOne.mockResolvedValue(board);
      mockBoardRepository.update.mockResolvedValue(null);

      const data = await service.update(1, updateBoardDto);

      expect(mockBoardRepository.update).toHaveBeenCalledWith(1, updateBoardDto);
      expect(data).toEqual({ ...board, ...updateBoardDto });
    });
  });

  it('보드를 찾을 수 없으면 NotFoundException을 발생시켜야 합니다.', async () => {
    mockBoardRepository.findOne.mockResolvedValue(null);

    await expect(service.update(1, { name: 'Updated Board' })).rejects.toThrow(NotFoundException);
  });

  describe('remove', () => {
    it('올바른 ID의 보드를 삭제해야 합니다.', async () => {
      mockBoardRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await service.remove(1);

      expect(mockBoardRepository.delete).toHaveBeenCalledWith(1);
      expect(result).toEqual({ message: '보드가 성공적으로 삭제되었습니다.' });
    });

    it('보드를 찾을 수 없으면 NotFoundException을 발생시켜야 합니다.', async () => {
      mockBoardRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });
  });
});
