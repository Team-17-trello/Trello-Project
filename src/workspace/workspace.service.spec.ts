import { Test, TestingModule } from '@nestjs/testing';
import { WorkspaceService } from './workspace.service';
import { WorkspaceEntity } from './entities/workspace.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common';
import { UserEntity } from 'src/user/entities/user.entity';
import { MemberEntity } from 'src/member/entity/member.entity';

describe('WorkspaceService', () => {
  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
  };

  let workspaceService: WorkspaceService;
  let workspaceRepository: Repository<WorkspaceEntity>;
  let userRepository: Repository<UserEntity>;
  let memberRepository: Repository<MemberEntity>;
  beforeEach(async () => {
    jest.clearAllMocks();

    const mockworkspace: WorkspaceEntity = {
      id: 1,
      workspaceName: 'Test workspace',
    } as WorkspaceEntity;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkspaceService,
        {
          provide: getRepositoryToken(WorkspaceEntity),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(MemberEntity),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    workspaceService = module.get<WorkspaceService>(WorkspaceService);
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
    mockRepository.find.mockResolvedValue(workspace);

    const result = await workspaceService.getAllWorkspace();
    console.log(result);
    expect(workspaceRepository.find).toHaveBeenCalled();
    expect(result).toEqual(workspace);
  });

  it('워크스페이스 조회 실패 테스트', async () => {
    mockRepository.find.mockResolvedValue([]);

    await expect(workspaceService.getAllWorkspace()).rejects.toThrow(BadRequestException);
  });

  it('워크스페이스 상세 조회 테스트', async () => {
    const workspace = {
      id: 1,
      workspaceName: 'Test한다잉',
      createdAt: '2024-11-08T06:04:17.590Z',
      members: [
        {
          isAdmin: true,
          user: {
            id: 1,
            nickname: 'test',
          },
        },
      ],
    };

    mockRepository.findOne.mockResolvedValue(workspace);

    const result = await workspaceService.getWorkspaceById(1);

    expect(result).toEqual(workspace);
    expect(mockRepository.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
      relations: { members: true },
    });
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

    memberRepository.findOne = jest
      .fn()
      .mockResolvedValueOnce({ id: 1, isAdmin: true })
      .mockResolvedValueOnce(null);

    userRepository.findOne = jest.fn().mockResolvedValue(user);
    memberRepository.create = jest.fn().mockResolvedValue(newMember);
    memberRepository.save = jest.fn().mockResolvedValue(newMember);

    const result = await workspaceService.addWorkspaceMember(user, workspaceId, userIds);

    expect(result).toEqual(message);
  });
});
