import { Test, TestingModule } from '@nestjs/testing';
import { BoardController } from './board.controller';
import { BoardService } from './board.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { BoardEntity } from './entities/board.entity';

describe('BoardController', () => {
  let boardController: BoardController;
  let boardService: BoardService;

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
    }).compile();

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

    const expectedResult: BoardEntity = {
      id: 1,
      name: 'board',
      description: 'description',
      backgroundColor: '#FFFF',
      userId: 1,
      createdAt: new Date('2022-01-01T00:00:00Z'),
      updatedAt: new Date('2022-01-01T00:00:00Z'),
      lists: [],
    };

    (boardService.create as jest.Mock).mockResolvedValue(expectedResult);

    const result = await boardController.create(createBoardDto);

    expect(result).toEqual(expectedResult);
    expect(boardService.create).toHaveBeenCalledWith(createBoardDto);
  });

  it('보드 전체 조회 검증', async () => {
    const expectedResult = [
      { id: 1, name: 'board', userId: 1 },
      { id: 2, name: 'board2', userId: 2 },
    ];

    (boardService.findAll as jest.Mock).mockResolvedValue(expectedResult);
    const result = await boardController.findAll();
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

    const expectedResult: BoardEntity = {
      id: 1,
      name: 'new Board',
      description: 'description',
      backgroundColor: '#FFFF',
      userId: 1,
      createdAt: new Date('2022-01-01T00:00:00Z'),
      updatedAt: new Date('2022-01-01T00:00:00Z'),
      lists: [], // 관계 형성하면서 추가됨 오류시 이부분 수정
    };

    (boardService.update as jest.Mock).mockResolvedValue(expectedResult);

    const result = await boardController.update(boardId, updateBoardDto);

    expect(result).toEqual(expectedResult);
    expect(boardService.update).toHaveBeenCalledWith(boardId, updateBoardDto);
  });

  it('보드 삭제 검증', async () => {
    const boardId = 1;
    const expectedResult = { message: '보드가 성공적으로 삭제 되었습니다.' };

    (boardService.remove as jest.Mock).mockResolvedValue(expectedResult);

    const result = await boardController.remove(boardId);
    expect(result).toEqual(expectedResult);
    expect(boardService.remove).toHaveBeenCalledWith(1);
  });
});
