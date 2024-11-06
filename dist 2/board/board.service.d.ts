import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { BoardEntity } from './entities/board.entity';
export declare class BoardService {
    private readonly boardRepository;
    constructor(boardRepository: Repository<BoardEntity>);
    create(createBoardDto: CreateBoardDto, user: User): Promise<BoardEntity>;
    findAll(workspaceId: number): Promise<{
        boards: BoardEntity[];
    }>;
    findOne(id: number): Promise<BoardEntity>;
    update(id: number, updateBoardDto: UpdateBoardDto, user: User): Promise<BoardEntity>;
    remove(id: number, user: User): Promise<{
        message: string;
    }>;
    verifyBoardByUserId(userId: number, boardId: number): Promise<BoardEntity>;
}
