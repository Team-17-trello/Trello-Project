import { ChecklistService } from './checklist.service';
import { CreateChecklistDto } from './dto/create-checklist.dto';
import { UpdateChecklistDto } from './dto/update-checklist.dto';
export declare class ChecklistController {
    private readonly checklistService;
    constructor(checklistService: ChecklistService);
    create(createChecklistDto: CreateChecklistDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateChecklistDto: UpdateChecklistDto): string;
    remove(id: string): string;
}
