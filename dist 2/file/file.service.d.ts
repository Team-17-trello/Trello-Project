import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
export declare class FileService {
    create(createFileDto: CreateFileDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateFileDto: UpdateFileDto): string;
    remove(id: number): string;
}
