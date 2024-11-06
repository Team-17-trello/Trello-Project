import { BoardService } from './board.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { User } from 'src/user/entities/user.entity';
export declare class BoardController {
    private readonly boardService;
    constructor(boardService: BoardService);
    create(createBoardDto: CreateBoardDto, user: User): Promise<import("./entities/board.entity").BoardEntity>;
    findAll(workspaceId: number): Promise<{
        boards: import("./entities/board.entity").BoardEntity[];
    }>;
    findOne(boardId: number): Promise<import("./entities/board.entity").BoardEntity>;
    update(boardId: number, updateBoardDto: UpdateBoardDto, user: User): Promise<import("./entities/board.entity").BoardEntity>;
    remove(boardId: number, user: User): Promise<{
        message: string;
    }>;
}
