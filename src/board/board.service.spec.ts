import { Test, TestingModule } from '@nestjs/testing';
import { BoardService } from './board.service';
import { Repository } from 'typeorm';
import { BoardEntity } from './entities/board.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';

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
      //테스트 할것들 정의
      const createBoardDto = {
        name: 'Test Board',
        description: 'Test Description',
        //백그라운드 컬러는 안넣음
      };
      //모킹
      mockBoardRepository.save.mockResolvedValue(createBoardDto);

      const data = await service.create(createBoardDto);
      //테스트 expect
      expect(mockBoardRepository.save).toHaveBeenCalledWith(createBoardDto);
      expect(data).toEqual(createBoardDto);
    });
  });

  describe('findAll', () => {
    it('모든 보드를 조회해야 합니다.', async () => {
      const boards = [
        {
          id: 1,
          name: 'Board 1',
        },
      ];
      mockBoardRepository.find.mockResolvedValue(boards);

      const data = await service.findAll();

      expect(mockBoardRepository.find).toHaveBeenCalledTimes(1);
      expect(data).toEqual(boards);
    });
  });
  describe('findOne', () => {
    it('올바른 ID로 보드를 조회해야합니다.', async () => {
      const board = {
        id: 1,
        name: 'Board 1',
      };

      mockBoardRepository.findOne.mockResolvedValue(board);

      const data = await service.findOne(1);

      expect(mockBoardRepository.findOne).toHaveBeenCalledWith(1);
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
      };
      const board = {
        id: 1,
        name: 'Board 1',
      };
      mockBoardRepository.update.mockResolvedValue(null);
      mockBoardRepository.findOne.mockResolvedValue({ ...board, ...updateBoardDto });

      const data = await service.update(1, updateBoardDto);

      expect(mockBoardRepository.update).toHaveBeenCalledWith(1, updateBoardDto);
      expect(data).toEqual({ ...board, ...updateBoardDto });
    });
  });
  describe('remove', () => {
    it('올바른 ID의 보드를 삭제해야 합니다.', async () => {
      mockBoardRepository.delete.mockResolvedValue({ affected: 1 });

      await service.remove(1);

      expect(mockBoardRepository.delete).toHaveBeenCalledWith(1);
    });
  });
});
