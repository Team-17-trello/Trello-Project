import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { ListService } from './list.service';
import { User } from 'src/user/entities/user.entity';
export declare class ListController {
    private readonly listService;
    constructor(listService: ListService);
    create(createListDto: CreateListDto, user: User): Promise<import("./entities/list.entity").ListEntity>;
    findAll(boardId: number): string;
    findOne(listId: number): string;
    update(listId: number, updateListDto: UpdateListDto, user: User): string;
    remove(listId: number, user: User): string;
}
