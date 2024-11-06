import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { Repository } from 'typeorm';
import { ListEntity } from './entities/list.entity';
import { User } from 'src/user/entities/user.entity';
export declare class ListService {
    private readonly listRepository;
    constructor(listRepository: Repository<ListEntity>);
    create(createListDto: CreateListDto, user: User): Promise<ListEntity>;
    findAll(boardId: number): string;
    findOne(id: number): string;
    update(id: number, updateListDto: UpdateListDto, user: User): string;
    remove(id: number, user: User): string;
}
