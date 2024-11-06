import { CreateChecklistDto } from './dto/create-checklist.dto';
import { UpdateChecklistDto } from './dto/update-checklist.dto';
export declare class ChecklistService {
    create(createChecklistDto: CreateChecklistDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateChecklistDto: UpdateChecklistDto): string;
    remove(id: number): string;
}
