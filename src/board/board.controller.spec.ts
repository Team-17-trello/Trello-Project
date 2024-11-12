import { Test, TestingModule } from '@nestjs/testing';
import { MemberGuard } from 'src/guard/members.guard';
import { UserEntity } from 'src/user/entities/user.entity';
import { BoardController } from './board.controller';
import { BoardService } from './board.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

describe('BoardController', () => {
  let boardController: BoardController;
  let boardService: BoardService;
  const mockUser: UserEntity = {
    id: 1,
    email: 'email@test.com',
    password: 'password',
    nickname: 'nickname',
  } as UserEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BoardController],
      providers: [
        {
          provide: BoardService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(MemberGuard)
      .useValue({})
      .compile();

    boardController = module.get<BoardController>(BoardController);
    boardService = module.get<BoardService>(BoardService);
  });

  it('보드 생성 검증', async () => {
    const createBoardDto: CreateBoardDto = {
      workspaceId: 1,
      name: 'board',
      description: 'description',
      backgroundColor: '#FFFF',
    };

    const result = { id: 1, ...createBoardDto, mockUser };

    (boardService.create as jest.Mock).mockResolvedValue(result);

    const response = await boardController.create(createBoardDto, mockUser);

    expect(boardService.create).toHaveBeenCalledWith(createBoardDto, mockUser);
    expect(response).toEqual(result);
  });

  it('보드 전체 조회 검증', async () => {
    const workspaceId = 1;
    const expectedResult = [
      { id: 1, name: 'board', userId: 1 },
      { id: 2, name: 'board2', userId: 2 },
    ];

    (boardService.findAll as jest.Mock).mockResolvedValue(expectedResult);
    const result = await boardController.findAll(workspaceId);
    expect(result).toEqual(expectedResult);
    expect(boardService.findAll).toHaveBeenCalled();
  });

  it('보드 상세 조회 검증', async () => {
    const boardId = 1;
    const expectedResult = {
      id: 1,
      name: 'board',
      description: 'description',
      backgroundColor: '#FFFF',
      userId: 1,
      createdAt: new Date('2022-01-01T00:00:00Z'),
    };

    (boardService.findOne as jest.Mock).mockResolvedValue(expectedResult);

    const result = await boardController.findOne(boardId);
    expect(result).toEqual(expectedResult);
    expect(boardService.findOne).toHaveBeenCalledWith(boardId);
  });

  it('보드 수정 검증', async () => {
    const boardId = 1;
    const updateBoardDto: UpdateBoardDto = {
      name: 'new Board',
    };

    const expectedResult = {
      id: boardId,
      name: updateBoardDto.name || 'default name',
      user: mockUser,
    };

    (boardService.update as jest.Mock).mockResolvedValue(expectedResult);

    const result = await boardController.update(boardId, updateBoardDto, mockUser);

    expect(result).toEqual(expectedResult);
    expect(boardService.update).toHaveBeenCalledWith(boardId, updateBoardDto, mockUser);
  });

  it('보드 삭제 검증', async () => {
    const boardId = 1;
    const expectedResult = { message: '보드가 성공적으로 삭제 되었습니다.' };

    (boardService.remove as jest.Mock).mockResolvedValue(expectedResult);

    const result = await boardController.remove(boardId, mockUser);
    expect(result).toEqual(expectedResult);
    expect(boardService.remove).toHaveBeenCalledWith(boardId, mockUser);
  });
});
