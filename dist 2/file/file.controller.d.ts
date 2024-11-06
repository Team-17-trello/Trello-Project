import { FileService } from './file.service';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
export declare class FileController {
    private readonly fileService;
    constructor(fileService: FileService);
    create(createFileDto: CreateFileDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateFileDto: UpdateFileDto): string;
    remove(id: string): string;
}
