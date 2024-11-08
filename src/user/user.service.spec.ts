import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import mock = jest.mock;

jest.mock('bcrypt');

describe('UserService', () => {
  let userService: UserService;
  let userRepository: Repository<UserEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            findOne: jest.fn(),
            update: jest.fn(),
          },
        }],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<Repository<UserEntity>>(getRepositoryToken(UserEntity));
  });


  describe('update', () => {

    it('변경할 닉네임이 중복되면 ConflictException 던짐', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce({
        id: 1,
        email: 'test@test.com',
        password: 'test1234',
        nickname: 'tester',
      } as UserEntity);

      const mockUpdateDto = {
        nickname: 'newNickname',
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce({
        id: 2,
        email: 'test1@test1.com',
        password: 'test1234',
        nickname: mockUpdateDto.nickname,
      } as UserEntity);

      await expect(userService.update({
          id: 1,
          email: 'test@test.com',
          password: 'test1234',
          nickname: 'tester',
        } as UserEntity, mockUpdateDto,
      )).rejects.toThrow(ConflictException);
    });

    it('변경에 성공하면 변경한 user 객체를 리턴', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce({
        id: 1,
        email: 'test@test.com',
        password: 'test1234',
        nickname: 'tester',
      } as UserEntity);

      const mockUpdateDto = {
        nickname: 'newNickname',
        password: 'newPassword',
      };
      jest.spyOn(bcrypt, 'hash').mockResolvedValueOnce('hashedNewPassword' as never);


      // 업데이트 결과를 모킹하여 저장
      const saveSpy = jest.spyOn(userRepository, 'update').mockResolvedValueOnce({
        affected: 2,
      } as UpdateResult);

      // 업데이트 실행 및 결과 검증
      const result = await userService.update({
        id: 1,
        email: 'test@test.com',
        password: 'test1234',
        nickname: 'tester',
      } as UserEntity, mockUpdateDto);

      // 반환된 결과가 예상과 일치하는지 확인
      expect(result).toEqual({
        affected: 2,
      });

      // bcrypt.hash가 한 번 호출되었는지 확인
      expect(bcrypt.hash).toHaveBeenCalledWith('newPassword', 10);

      // userRepository.update가 호출되었는지 확인
      expect(saveSpy).toHaveBeenCalledTimes(1);
      expect(saveSpy).toHaveBeenCalledWith(1, {
        nickname: 'newNickname',
        password: 'hashedNewPassword',
      });
    });

    describe('remove', () => {

      it('비밀 번호가 일치 하지 않으면 UnauthorizedException 던짐', async () => {
        jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce({
          id: 1,
          email: 'test@test.com',
          password: await bcrypt.hash('wrongPassword', 10),
        } as UserEntity);

        await expect(userService.remove({
          id: 1,
          email: 'test@test.com',
          password: await bcrypt.hash('wrongPassword', 10),
          nickname: 'tester',
        } as UserEntity, {
          password: 'test1234',
        })).rejects.toThrow(UnauthorizedException);


      });

      it('비밀 번호 인증 성공 시 회원 탈퇴 성공', async () => {
        jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce({
          id: 1,
          email: 'test@test.com',
          password: await bcrypt.hash('wrongPassword', 10),
        } as UserEntity);
        (bcrypt.compare as jest.Mock).mockResolvedValue(true);

        const updateSpy = jest.spyOn(userRepository, 'update').mockResolvedValueOnce(undefined);

        const result = await userService.remove({
          id: 1,
          email: 'test@test.com',
          password: 'test1234',
        } as UserEntity, { password: await bcrypt.hash('wrongPassword', 10) });

        expect(result).toEqual({
          statusCode: 200,
          message: '계정이 성공적으로 삭제 되었습니다.',
        });

        expect(updateSpy).toHaveBeenCalledWith(1, {
          email: null,
          password: null,
          nickname: null,
          deletedAt: new Date(),
        });

      });
    });
  });
});
