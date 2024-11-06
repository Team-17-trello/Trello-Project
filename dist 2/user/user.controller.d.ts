import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { RemoveUserDto } from './dto/remove.dto';
import { User } from './entities/user.entity';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    update(user: User, userUpdateDto: UpdateUserDto): Promise<import("typeorm").UpdateResult>;
    remove(user: User, removeUserDto: RemoveUserDto): Promise<{
        statusCode: number;
        message: string;
    }>;
}
