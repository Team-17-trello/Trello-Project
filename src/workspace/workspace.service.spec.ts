import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MailService } from 'src/auth/email/email.service';
import { MemberEntity } from 'src/member/entity/member.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { WorkspaceEntity } from './entities/workspace.entity';
import { WorkspaceService } from './workspace.service';

jest.mock('src/auth/email/email.service');

describe('WorkspaceService', () => {
  let workspaceService: WorkspaceService;
  let workspaceRepository: Repository<WorkspaceEntity>;
  let userRepository: Repository<UserEntity>;
  let memberRepository: Repository<MemberEntity>;
  let mailService: MailService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkspaceService,
        MailService,
        {
          provide: getRepositoryToken(WorkspaceEntity),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(MemberEntity),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            sendMail: jest.fn(),
          },
        },
        {
          provide: MailService,
          useValue: {
            sendInvitationEmail: jest.fn().mockResolvedValue('이메일이 정상적으로 보내졌습니다.'),
            sendMemberEmail: jest.fn(),
          },
        },
      ],
    }).compile();

    workspaceService = module.get<WorkspaceService>(WorkspaceService);
    mailService = module.get<MailService>(MailService);
    workspaceRepository = module.get<Repository<WorkspaceEntity>>(
      getRepositoryToken(WorkspaceEntity),
    );
    memberRepository = module.get<Repository<MemberEntity>>(getRepositoryToken(MemberEntity));
    userRepository = module.get<Repository<UserEntity>>(getRepositoryToken(UserEntity)); // 모킹된 리포지토리 가져오기
  });

  it('워크스페이스 생성 테스트', async () => {
    const user: UserEntity = {
      id: 1,
      email: 'test@test',
      password: 'password',
      nickname: 'nickname',
      createdAt: new Date(),
      deletedAt: null,
      members: [],
    };

    const createWorkspaceDto = { workspaceName: 'test workspace' };
    const newWorkspace = {
      id: 1,
      workspaceName: 'test workspace',
      userId: user.id,
      createdAt: new Date(),
    };
    const createMember = {
      isAdmin: true,
      user,
      workspace: newWorkspace,
    };

    workspaceRepository.create = jest.fn().mockReturnValue(newWorkspace);
    workspaceRepository.save = jest.fn().mockResolvedValue(newWorkspace);
    memberRepository.create = jest.fn().mockReturnValue(createMember);
    memberRepository.save = jest.fn().mockResolvedValue(createMember);

    const result = await workspaceService.workspaceCreate(user, createWorkspaceDto);

    expect(workspaceRepository.create).toHaveBeenCalledWith({
      workspaceName: createWorkspaceDto.workspaceName,
      userId: user.id,
    });
    expect(workspaceRepository.save).toHaveBeenCalledWith(newWorkspace);
    expect(memberRepository.create).toHaveBeenCalledWith({
      isAdmin: true,
      user,
      workspace: newWorkspace,
    });
    expect(memberRepository.save).toHaveBeenCalledWith(createMember);
    expect(result).toEqual(newWorkspace);
  });

  it('워크스페이스 조회 테스트', async () => {
    const workspace = [{ id: 1, workspaceName: 'test', craetedAt: new Date() }];
    workspaceRepository.find = jest.fn().mockResolvedValue(workspace);

    const result = await workspaceService.getAllWorkspace();
    console.log(result);
    expect(workspaceRepository.find).toHaveBeenCalled();
    expect(result).toEqual(workspace);
  });

  it('워크스페이스 조회 실패 테스트', async () => {
    workspaceRepository.find = jest.fn().mockResolvedValue([]);

    await expect(workspaceService.getAllWorkspace()).rejects.toThrow(BadRequestException);
  });

  it('워크스페이스 상세 조회 테스트', async () => {
    const expectedQuery = {
      where: { id: 1 },
      relations: ['members', 'members.user'],
      select: {
        id: true,
        workspaceName: true,
        createdAt: true,
        members: {
          isAdmin: true,
          user: {
            id: true,
            nickname: true,
          },
        },
      },
    };
    const workspaceId: number = 1;
    workspaceRepository.findOne = jest.fn().mockResolvedValue(expectedQuery);

    const result = await workspaceService.getWorkspaceById(1);

    expect(result).toEqual(expectedQuery);
  });

  it('멤버가 성공적으로 초대 되었는가', async () => {
    const user: UserEntity = {
      id: 1,
      email: 'test@test.com',
      password: 'aaaa4321',
      nickname: '테스터',
      createdAt: new Date(),
      deletedAt: new Date(),
      members: [],
    };

    const workspaceId = 1;

    const userIds = [2];

    const workspace = {
      id: 1,
      workspaceName: 'test Workspace',
      createdAt: new Date(),
      userId: 1,
      members: [],
      boards: [],
      cards: [],
    } as WorkspaceEntity;

    const newMember: MemberEntity = {
      id: 2,
      createdAt: new Date(),
      isAdmin: false,
      workspace,
      user,
    };

    const message = { message: '멤버를 성공적으로 초대했습니다.' };

    memberRepository.findOne = jest.fn().mockResolvedValueOnce({ id: 1, isAdmin: true });

    workspaceRepository.findOne = jest.fn().mockResolvedValue(workspace);
    userRepository.findOne = jest.fn().mockResolvedValue(user);
    memberRepository.create = jest.fn().mockResolvedValue(newMember);
    memberRepository.save = jest.fn().mockResolvedValue(newMember);

    mailService.sendEmail = jest.fn().mockRejectedValue('Test');

    const result = await workspaceService.addWorkspaceMember(user, workspaceId, userIds);

    expect(mailService.sendMemberEmail).toHaveBeenCalledWith('test@test.com');
    expect(mailService.sendMemberEmail).toHaveBeenCalledTimes(1);
    expect(result).toEqual(message);
  });
});
