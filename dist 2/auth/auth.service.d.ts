import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private readonly userRepository;
    private readonly jwtService;
    constructor(userRepository: Repository<User>, jwtService: JwtService);
    signup(signUpDto: SignupDto): Promise<string>;
    login(loginDto: LoginDto): Promise<{
        statusCode: number;
        access_token: string;
    }>;
}
