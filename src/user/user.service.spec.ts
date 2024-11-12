import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { MemberEntity } from 'src/member/entity/member.entity';
import { EntityManager, Repository, UpdateResult } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { UserService } from './user.service';
import mock = jest.mock;

jest.mock('bcrypt');

describe('UserService', () => {
  let userService: UserService;
  let userRepository: Repository<UserEntity>;
  let memberRepository: Repository<MemberEntity>;
  let mockEntityManager: Partial<EntityManager>;

  const mockUser = {
    id: 1,
    email: 'test@test.com',
    password: '',
    nickname: 'tester',
    createdAt: new Date(),
    deletedAt: null,
    members: [],
  };

  beforeEach(async () => {
    mockUser.password = await bcrypt.hash('TestPassword', 10);

    mockEntityManager = {
      transaction: jest.fn().mockImplementation((callback) => callback(mockEntityManager)),
      getRepository: jest.fn().mockReturnThis(),
      softDelete: jest.fn().mockResolvedValue({}),
      delete: jest.fn().mockResolvedValue({}),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            findOne: jest.fn(),
            update: jest.fn(),
            softDelete: jest.fn(),
            delete: jest.fn(),
          },
        },

        {
          provide: getRepositoryToken(MemberEntity),
          useValue: {
            find: jest.fn(),
            delete: jest.fn(),
          },
        },

        {
          provide: EntityManager,
          useValue: mockEntityManager,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<Repository<UserEntity>>(getRepositoryToken(UserEntity));
    memberRepository = module.get<Repository<MemberEntity>>(getRepositoryToken(MemberEntity));
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

      await expect(
        userService.update(
          {
            id: 1,
            email: 'test@test.com',
            password: 'test1234',
            nickname: 'tester',
          } as UserEntity,
          mockUpdateDto,
        ),
      ).rejects.toThrow(ConflictException);
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
      const result = await userService.update(
        {
          id: 1,
          email: 'test@test.com',
          password: 'test1234',
          nickname: 'tester',
        } as UserEntity,
        mockUpdateDto,
      );

      // 반환된 결과가 예상과 일치하는지 확인
      expect(result).toEqual({
        message: '수정이 완료되었습니다.',
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
      const mockmembers: MemberEntity[] = [
        { id: 1, isAdmin: true, user: mockUser, workspace: null, createdAt: new Date() },
      ];

      it('비밀번호가 일치하지 않으면 UnauthorizedException을 던진다', async () => {
        (bcrypt.compare as jest.Mock).mockResolvedValue(false);

        jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce({
          id: 1,
          email: 'test@test.com',
          password: await bcrypt.hash('correctPassword', 10),
          nickname: 'teaster',
        } as UserEntity);

        await expect(
          userService.remove(
            {
              id: 1,
              email: 'test@test.com',
              password: 'wrongPassword',
              nickname: 'tester',
            } as UserEntity,
            {
              password: 'wrongPassword',
            },
          ),
        ).rejects.toThrow(UnauthorizedException);
      });

      it('1개 이상 워크 스페이스에서 관리자일 시 ConflictEcxeption 반환', async () => {
        //find 하고 findOne 모킹 , bcrypt 모킹
        jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);
        jest.spyOn(memberRepository, 'find').mockResolvedValue(mockmembers);
        (bcrypt.compare as jest.Mock).mockResolvedValue(true);

        await expect(
          userService.remove(
            {
              id: 1,
              email: 'Test@example.com',
              password: '123123',
              nickname: 'mungSoon',
            } as UserEntity,
            { password: '123123' },
          ),
        ).rejects.toThrow(ConflictException);

        expect(memberRepository.find).toHaveBeenCalled();
      });

      it('비밀 번호 인증 성공 시 회원 탈퇴 성공', async () => {
        (bcrypt.compare as jest.Mock).mockResolvedValue(true);

        const mockRemoveUserDto = { password: 'TestPaswword' };

        jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(mockUser);
        jest.spyOn(memberRepository, 'find').mockResolvedValueOnce([]);

        const softDeleteSpy = jest
          .spyOn(mockEntityManager.getRepository(UserEntity), 'softDelete')
          .mockResolvedValue(undefined);

        const deleteSpy = jest
          .spyOn(mockEntityManager.getRepository(MemberEntity), 'delete')
          .mockResolvedValue(undefined);

        const result = await userService.remove(mockUser as UserEntity, mockRemoveUserDto);

        //같은지 확인.
        expect(result).toEqual({
          message: '계정이 성공적으로 삭제 되었습니다.',
        });

        //expect 2개 소프트 딜리트, 딜리트
        expect(softDeleteSpy).toHaveBeenCalledWith({ id: mockUser.id });
        expect(deleteSpy).toHaveBeenCalledWith({ user: { id: mockUser.id } });
      });
    });
  });
});
