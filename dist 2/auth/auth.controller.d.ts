import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    signup(signupDto: SignupDto): Promise<string>;
    login(loginDto: LoginDto): Promise<{
        statusCode: number;
        access_token: string;
    }>;
}
