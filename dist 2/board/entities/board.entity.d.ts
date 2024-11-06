import { ListEntity } from 'src/list/entities/list.entity';
export declare class BoardEntity {
    id: number;
    name: string;
    backgroundColor: string;
    description: string;
    userId: number;
    createdAt: Date;
    updatedAt: Date;
    lists: ListEntity[];
}
