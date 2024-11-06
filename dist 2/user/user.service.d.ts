import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { RemoveUserDto } from './dto/remove.dto';
export declare class UserService {
    private readonly userRepository;
    constructor(userRepository: Repository<User>);
    update(user: User, userUpdateDto: UpdateUserDto): Promise<import("typeorm").UpdateResult>;
    remove(user: User, removeUserDto: RemoveUserDto): Promise<{
        statusCode: number;
        message: string;
    }>;
}
