import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { WorkspaceEntity } from '../workspace/entities/workspace.entity';
import { MemberEntity } from './entity/member.entity';
import { MemberService } from './member.service';

describe('MemberService', () => {
  let memberService: MemberService;
  let memberRepository: Repository<MemberEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MemberService,
        {
          provide: getRepositoryToken(MemberEntity),
          useValue: {
            findOne: jest.fn(),
            update: jest.fn(),
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    memberService = module.get<MemberService>(MemberService);
    memberRepository = module.get<Repository<MemberEntity>>(getRepositoryToken(MemberEntity));
  });

  describe('switch', () => {
    const user: UserEntity = {
      id: 1,
      email: 'test@test.com',
      password: 'test1234',
      nickname: 'tester',
      createdAt: new Date(),
      deletedAt: null,
      members: null,
    };

    const members2: MemberEntity[] = [
      {
        id: 1,
        createdAt: new Date(),
        isAdmin: true,
        workspace: null,
        user: user,
      },
      {
        id: 2,
        createdAt: new Date(),
        isAdmin: true,
        workspace: null,
        user: user,
      },
    ];

    const members: MemberEntity[] = [
      {
        id: 1,
        createdAt: new Date(),
        isAdmin: false,
        workspace: null,
        user: user,
      },
      {
        id: 2,
        createdAt: new Date(),
        isAdmin: true,
        workspace: null,
        user: user,
      },
    ];

    const member: MemberEntity = {
      id: 1,
      createdAt: new Date(),
      isAdmin: false,
      workspace: null,
      user: user,
    };

    const member2: MemberEntity = {
      id: 2,
      createdAt: new Date(),
      isAdmin: true,
      workspace: null,
      user: user,
    };

    const workspace: Partial<WorkspaceEntity> = {
      id: 1,
      workspaceName: 'Test workspace',
    };

    const anotherUser: Partial<UserEntity> = {};

    it('유저가 admin이 아닐 경우 UnauthorizedException 반환', () => {
      jest.spyOn(memberRepository, 'findOne').mockResolvedValue(member);
      expect(memberService.switch(user, 1, 1)).rejects.toThrow(UnauthorizedException);
    });

    // 유저가  유일한 admin 일경우
    // 유저가  유일한 admin 일 때 자신의 권한을 변경하려함
    it('유저가 유일한 admin일 경우 ConflictException 반환', () => {
      jest.spyOn(memberRepository, 'findOne').mockResolvedValue(member2);
      jest.spyOn(memberRepository, 'find').mockResolvedValue(members);
      expect(memberService.switch(user, workspace.id, 1)).rejects.toThrow(ConflictException);
    });

    it('유저가 admin 이고 다른 유저의 isAdmin 을 바꿀 경우', async () => {
      jest.spyOn(memberRepository, 'findOne').mockResolvedValueOnce(member2);
      jest.spyOn(memberRepository, 'findOne').mockResolvedValueOnce(member);
      jest.spyOn(memberRepository, 'find').mockResolvedValueOnce([member, member2]);

      await memberService.switch(user, 1, 2);

      expect(memberRepository.update).toHaveBeenCalledWith({ id: member.id }, { isAdmin: true });
    });

    it('유저가 admin 이고 자기 자신의 isAdmin 을 바꿀 경우', async () => {
      jest.spyOn(memberRepository, 'findOne').mockResolvedValueOnce(member2);
      jest.spyOn(memberRepository, 'findOne').mockResolvedValueOnce(member2);
      jest.spyOn(memberRepository, 'find').mockResolvedValueOnce(members2);

      await memberService.switch(user, 1, user.id);

      expect(memberRepository.update).toHaveBeenCalledWith({ id: member2.id }, { isAdmin: false });
    });
  });
});
