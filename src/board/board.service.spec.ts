import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
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
  findOneBy: jest.fn(),
};

describe('BoardService', () => {
  let service: BoardService;
  let repository: Repository<BoardEntity>;
  const mockUser: UserEntity = {
    id: 1,
    email: 'email@test.com',
    password: 'password',
    nickname: 'nickname',
  } as UserEntity;

  const mockBoard: BoardEntity = {
    id: 1,
    name: 'Test Board',
  } as BoardEntity;

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

      mockBoardRepository.create.mockReturnValue(mockBoard);
      mockBoardRepository.save.mockResolvedValue(mockBoard);

      const data = await service.create(createBoardDto, mockUser);

      expect(data).toEqual(mockBoard);
      expect(mockBoardRepository.create).toHaveBeenCalledWith({
        ...createBoardDto,
        userId: mockUser.id,
      });
      expect(mockBoardRepository.save).toHaveBeenCalledWith(mockBoard);
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
      const boardId = null;
      mockBoardRepository.find.mockResolvedValue(boards);

      const data = await service.findAll(boardId);

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

    it('보드를 찾을 수 없으면 예외가 발생해야 합니다.', async () => {
      mockBoardRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('해당하는 보드를 성공적으로 수정 합니다.', async () => {
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

      const updatedBoard = { ...board, ...updateBoardDto };

      jest.spyOn(service, 'verifyBoardByUserId').mockResolvedValue(undefined);
      mockBoardRepository.findOne.mockResolvedValue(board);
      mockBoardRepository.update.mockResolvedValue(undefined);

      const data = await service.update(1, updateBoardDto, mockUser);

      expect(service.verifyBoardByUserId).toHaveBeenCalledWith(mockUser.id, board.id);
      expect(mockBoardRepository.findOne).toHaveBeenCalledWith({ where: { id: board.id } });
      expect(mockBoardRepository.update).toHaveBeenCalledWith(board.id, updateBoardDto);
      expect(data).toEqual(updatedBoard);
    });

    it('보드를 찾을 수 없으면 BadRequestException 발생시켜야 합니다.', async () => {
      mockBoardRepository.findOne.mockResolvedValue(null);

      await expect(service.update(1, { name: 'Updated Board' }, mockUser)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('remove', () => {
    it('보드 삭제 성공 검증', async () => {
      const boardId = 1;
      const expectedResult = { message: '보드가 성공적으로 삭제되었습니다.' };

      jest.spyOn(service, 'verifyBoardByUserId').mockResolvedValue(undefined);
      mockBoardRepository.delete.mockResolvedValue({});

      const result = await service.remove(boardId, mockUser);

      expect(service.verifyBoardByUserId).toHaveBeenCalledWith(mockUser.id, boardId);
      expect(mockBoardRepository.delete).toHaveBeenCalledWith(boardId);
      expect(result).toEqual(expectedResult);
    });

    it('보드를 찾을 수 없으면 BadRequestException 발생시켜야 합니다.', async () => {
      const boardId = 1;
      mockBoardRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(service.remove(boardId, mockUser)).rejects.toThrow(BadRequestException);
      expect(mockBoardRepository.delete).not.toHaveBeenCalledWith();
    });
  });

  describe('verifyBoardByUserId', () => {
    it('유저 아이디와 보드 아이디로 보드 작성자를 확인 합니다.', async () => {
      const mockBoard = { id: 1, userId: 1 };
      mockBoardRepository.findOneBy.mockResolvedValue(mockBoard);

      const result = await service.verifyBoardByUserId(1, 1);

      expect(result).toBe(mockBoard);
      expect(mockBoardRepository.findOneBy).toHaveBeenCalledWith({ userId: 1, id: 1 });
    });

    it('유저 아이디와 보드 아이디가 없을 시 예외 처리 합니다.', async () => {
      mockBoardRepository.findOneBy.mockResolvedValue(null);

      await expect(service.verifyBoardByUserId(1, 1)).rejects.toThrow(BadRequestException);
      expect(mockBoardRepository.findOneBy).toHaveBeenCalledWith({ userId: 1, id: 1 });
    });
  });
});
