import { BoardEntity } from 'src/board/entities/board.entity';
export declare class ListEntity {
    id: number;
    name: string;
    order: number;
    createdAt: Date;
    updatedAt: Date;
    board: BoardEntity;
}
