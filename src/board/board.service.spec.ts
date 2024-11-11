import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { WorkspaceEntity } from 'src/workspace/entities/workspace.entity';
import { Repository } from 'typeorm';
import { BoardService } from './board.service';
import { UpdateBoardDto } from './dto/update-board.dto';
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

const mockWorkspaceRepository = {
  findOne: jest.fn(),
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
        {
          provide: getRepositoryToken(WorkspaceEntity),
          useValue: mockWorkspaceRepository,
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

      mockWorkspaceRepository.findOne.mockResolvedValue(createBoardDto.workspaceId);
      mockBoardRepository.create.mockReturnValue(mockBoard);
      mockBoardRepository.save.mockResolvedValue(mockBoard);

      const data = await service.create(createBoardDto, mockUser);

      expect(data).toEqual(mockBoard);
      expect(mockBoardRepository.create).toHaveBeenCalledWith({
        name: createBoardDto.name,
        description: createBoardDto.description,
        workspace: createBoardDto.workspaceId,
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
        lists: [
          {
            id: 1,
            name: 'List 1',
            order: 1,
            cards: [
              {
                id: 1,
                name: 'Card 1',
                description: 'Card Description',
                order: 1,
                dueDate: new Date(),
              },
            ],
          },
        ],
      };

      mockBoardRepository.findOne.mockResolvedValue(board);

      const data = await service.findOne(1);

      expect(mockBoardRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: {
          lists: true,
        },
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
      const updateBoardDto: UpdateBoardDto = { name: 'Updated Board' };
      const user: UserEntity = { id: 1 } as UserEntity;
      const board = { id: 1, userId: user.id } as BoardEntity;
      const existingBoard = { id: 1, name: 'Old Board', userId: user.id } as BoardEntity;

      jest.spyOn(mockBoardRepository, 'findOne').mockResolvedValue(existingBoard);
      jest.spyOn(mockBoardRepository, 'findOneBy').mockResolvedValue(board);
      jest.spyOn(service, 'findOne').mockResolvedValue(existingBoard);
      jest.spyOn(mockBoardRepository, 'update').mockResolvedValue(null);

      const result = await service.update(1, updateBoardDto, user);
      expect(result).toEqual({ ...existingBoard, ...updateBoardDto });
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
      const user: UserEntity = { id: 1 } as UserEntity;
      const board = { id: 1, userId: user.id } as BoardEntity;

      jest.spyOn(mockBoardRepository, 'findOne').mockResolvedValue(board);
      jest.spyOn(mockBoardRepository, 'findOneBy').mockResolvedValue(board);
      jest.spyOn(mockBoardRepository, 'delete').mockResolvedValue(null);

      const result = await service.remove(1, user);
      expect(result).toEqual({ message: '보드가 성공적으로 삭제되었습니다.' });
    });

    it('보드를 찾을 수 없으면 BadRequestException 발생시켜야 합니다.', async () => {
      const user: UserEntity = { id: 2 } as UserEntity;
      const board = { id: 1, userId: 1 } as BoardEntity;

      jest.spyOn(mockBoardRepository, 'findOne').mockResolvedValue(null);
      await expect(service.remove(1, user)).rejects.toThrow(BadRequestException);
    });
  });
});
