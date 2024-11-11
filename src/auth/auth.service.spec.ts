import { RedisService } from '@liaoliaots/nestjs-redis';
import { BadRequestException, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { AuthService } from './auth.service';

jest.mock('bcrypt');

jest.mock('redis', () => ({
  createClient: jest.fn(() => mockRedisClient),
}));

const mockRedisClient = {
  get: jest.fn().mockResolvedValue('mockedCode'),
  set: jest.fn().mockResolvedValue('OK'),
};

describe('AuthService', () => {
  let authService: AuthService;
  let userRepository: Repository<UserEntity>;
  let jwtService: JwtService;
  let redisService: RedisService;
  let mockRedisClient: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
        {
          provide: RedisService,
          useValue: {
            get: jest.fn(),
            getOrThrow: jest.fn(() => mockRedisClient),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<UserEntity>>(getRepositoryToken(UserEntity));
    jwtService = module.get<JwtService>(JwtService);
    redisService = module.get<RedisService>(RedisService);
  });

  describe('signup', () => {
    it('인증 코드가 일치 하지 않으면 BadRequestException 반환한다', async () => {
      jest.spyOn(authService as any, 'verifyCode').mockResolvedValue(false);

      const signUpDto = {
        email: 'didthfls2@naver.com',
        password: 'sorin1234',
        confirmedPassword: 'sorin12345',
        nickname: 'sorin',
        code: '123456',
      };
      await expect(authService.signup(signUpDto)).rejects.toThrow(BadRequestException);
    });

    it('유저가 이미 존재하면 ConflictException 던진다.', async () => {
      jest.spyOn(authService as any, 'verifyCode').mockResolvedValue(true);

      // 유저가 이미 존재하는 상황을 Mock
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(new UserEntity());

      // signUp 호출 시 ConflictException 발생 예상
      await expect(
        authService.signup({
          email: 'test@test.com',
          password: 'test1234',
          confirmedPassword: 'test1234',
          nickname: 'tester',
          code: null,
        }),
      ).rejects.toThrow(ConflictException);
    });

    it('비밀번호가 비밀번호 확인과 일치 하지 않으면 회원가입에 실패해야함', async () => {
      jest.spyOn(authService as any, 'verifyCode').mockResolvedValue(true);
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(null);

      await expect(
        authService.signup({
          email: 'didthfls2@naver.com',
          password: 'sorin1234',
          confirmedPassword: 'sorin12345',
          nickname: 'sorin',
          code: null,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('닉네임이 유일하지 않으면 회원가입에 실패해야함', async () => {
      jest.spyOn(authService as any, 'verifyCode').mockResolvedValue(true);
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(null);

      // 비밀번호 일치 확인

      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(new UserEntity());

      await expect(
        authService.signup({
          email: 'didthfls2@naver.com',
          password: 'sorin1234',
          confirmedPassword: 'sorin1234',
          nickname: 'sorin',
          code: null,
        }),
      ).rejects.toThrow(ConflictException);
    });

    it('유저가 성공적으로 생성되면 "회원가입이 성공했습니다!" 메시지를 반환한다.', async () => {
      jest.spyOn(authService as any, 'verifyCode').mockResolvedValue(true);
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');

      const saveSpy = jest.spyOn(userRepository, 'save').mockResolvedValueOnce({
        id: 1,
        email: 'test@test.com',
        password: 'hashedPassword',
        nickname: 'tester',
      } as UserEntity);

      const result = await authService.signup({
        email: 'test@test.com',
        password: 'test1234',
        confirmedPassword: 'test1234',
        nickname: 'tester',
        code: '111111',
      });
      expect(result).toEqual({ message: '회원가입에 성공했습니다!' });
      expect(bcrypt.hash).toHaveBeenCalledWith('test1234', 10);
      expect(saveSpy).toHaveBeenCalledTimes(1);
      expect(saveSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'test@test.com',
          password: 'hashedPassword',
          nickname: 'tester',
        }),
      );
    });
  });

  describe('logIn', () => {
    it('로그인 시 해당 유저 존재하지 않을시 UnauthorizedException 던지기', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(null);

      await expect(
        authService.login({
          email: 'test@test.com',
          password: 'test1234',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('로그인 비밀번호 미 일치 시 UnauthorizedException 던지기', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce({
        id: 1,
        email: 'test@test.com',
        password: await bcrypt.hash('wrongPassword', 10),
      } as UserEntity);

      await expect(
        authService.login({
          email: 'test@test.com',
          password: 'test1234',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('로그인 성공 시 access_token 반환', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce({
        id: 1,
        email: 'test@test.com',
        password: await bcrypt.hash('test1234', 10),
      } as UserEntity);
      jest.spyOn(jwtService, 'sign').mockReturnValue('mockedAccessToken');
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await authService.login({
        email: 'test@test.com',
        password: 'test1234',
      });

      await expect(result).toEqual({
        access_token: 'mockedAccessToken',
      });
    });
  });
});
