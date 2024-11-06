import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { ConfigService } from '@nestjs/config';
declare const JwtStrategy_base: new (...args: any[]) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly configService;
    private userRepository;
    constructor(configService: ConfigService, userRepository: Repository<User>);
    validate(payload: any): Promise<User>;
}
export {};
