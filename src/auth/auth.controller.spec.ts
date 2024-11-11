import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: jest.Mocked<AuthService>;

  beforeEach(async () => {
    const mockAuthService = {
      signup: jest.fn(),
      login: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService) as jest.Mocked<AuthService>;
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('signup', () => {
    it('회원가입 메소드를 호출하고 결과를 반환한다.', async () => {
      const signupDto: SignupDto = {
        email: 'text@text.com',
        password: 'texttext11',
        confirmedPassword: 'texttext11',
        nickname: 'texter',
        code: null,
      };

      const mockResult = { message: '회원가입에 성공했습니다!' };
      authService.signup.mockResolvedValue(mockResult);

      const result = await authController.signup(signupDto);
      expect(authService.signup).toHaveBeenCalledWith(signupDto);
      expect(result).toEqual(mockResult);
    });
  });

  describe('signup', () => {
    it('로그인 메소드를 호출하고 결과를 반환한다.', async () => {
      const loginDto: LoginDto = {
        email: 'text@text.com',
        password: 'texttext11',
      };

      const mockToken = 'test';

      const mockResult = {
        access_token: mockToken,
      };
      authService.login.mockResolvedValue(mockResult);

      const result = await authController.login(loginDto);
      expect(authService.login).toHaveBeenCalledWith(loginDto);
      expect(result).toEqual(mockResult);
    });
  });
});
