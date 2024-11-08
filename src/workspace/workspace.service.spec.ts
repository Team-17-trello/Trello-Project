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
  let workspaceRepository: Repository<WorkspaceEntity>; // 모킹된 리포지토리
  let userRepository: Repository<UserEntity>;
  let memberRepository: Repository<MemberEntity>;
  beforeEach(async () => {
    jest.clearAllMocks();

    // 모킹된 리포지토리 생성

    const mockworkspace: WorkspaceEntity = {
      id: 1,
      workspaceName: 'Test workspace',
    } as WorkspaceEntity;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkspaceService,
        {
          provide: getRepositoryToken(WorkspaceEntity),
          useValue: mockRepository, // 모킹된 리포지토리 사용
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

    // 서비스와 모킹된 리포지토리 가져오기
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
    const newWorkspace = { id: 1, workspaceName: 'test workspace', createdAt: new Date() };
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

    expect(workspaceRepository.create).toHaveBeenCalledWith(createWorkspaceDto);
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
    const workspace = { id: 1, workspaceName: 'test', createdAt: new Date(), members: [] };

    workspaceRepository.findOne = jest.fn().mockResolvedValue(workspace);

    const result = await workspaceService.getWorkspaceById(1);
    expect(workspaceRepository.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
      relations: { members: true },
    });
    expect(result).toEqual(workspace);
  });

  it('')
});
