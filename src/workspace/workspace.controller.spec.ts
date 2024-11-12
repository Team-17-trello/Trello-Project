import { Test, TestingModule } from '@nestjs/testing';
import { MemberGuard } from 'src/guard/members.guard';
import { UserEntity } from 'src/user/entities/user.entity';
import { AddWorkspaceMemberDto } from './dto/add-workspace-member.dto';
import { WorkspaceController } from './workspace.controller';
import { WorkspaceService } from './workspace.service';

describe('워크스페이스 컨트롤러 유닛 테스트', () => {
  let workspaceController: WorkspaceController;
  let workspaceService: WorkspaceService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkspaceController],
      providers: [
        {
          provide: WorkspaceService,
          useValue: {
            getAllWorkspace: jest.fn(),
            getWorkspaceById: jest.fn(),
            workspaceCreate: jest.fn(),
            addWorkspaceMember: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(MemberGuard)
      .useValue({ canActivate: jest.fn().mockResolvedValue(true) })
      .compile();
    workspaceController = module.get<WorkspaceController>(WorkspaceController);
    workspaceService = module.get<WorkspaceService>(WorkspaceService);
  });

  it('워크스페이스 컨트롤러 상세 조회 테스트', async () => {
    const workspaceId = 1;
    const workspace = {
      workspaceId: 1,
      workspaceName: 'string',
    };
    (workspaceService.getWorkspaceById as jest.Mock).mockResolvedValue(workspace);
    const result = await workspaceController.findOne(workspaceId);
    expect(workspaceService.getWorkspaceById).toHaveBeenCalledWith(workspaceId);
    expect(result).toEqual(workspace);
  });

  it('워크스페이스 컨트롤러 조회 테스트', async () => {
    const workspace = [
      { workspaceId: 1, workspaceName: 'string', createAt: new Date() },
      { workspaceId: 2, workspaceName: 'string', createAt: new Date() },
    ];
    (workspaceService.getAllWorkspace as jest.Mock).mockResolvedValue(workspace);
    const workspace1 = await workspaceController.findAll();
    expect(workspace1).toEqual(workspace);
    expect(workspaceService.getAllWorkspace).toHaveBeenCalledWith();
  });

  it('워크스페이스 컨트롤러 생성 테스트 ', async () => {
    const user: UserEntity = {
      id: 1,
      nickname: 'test',
      email: 'test@test.com',
      password: 'password',
      createdAt: new Date(),
      deletedAt: null,
      members: [],
    };
    const createDto = { workspaceName: 'string' };
    const createWorkspace = {
      id: 1,
      workspaceName: 'string',
      createdAt: new Date(),
    };
    (workspaceService.workspaceCreate as jest.Mock).mockResolvedValue(createWorkspace);
    const result = await workspaceController.workspaceCreate(user, createDto);
    expect(result).toEqual({
      id: 1,
      workspaceName: 'string',
      createdAt: createWorkspace.createdAt,
    });
    expect(workspaceService.workspaceCreate).toHaveBeenCalledWith(user, createDto);
  });
  it('워크스페이스 컨트롤러 멤버 초대 테스트', async () => {
    const user: UserEntity = {
      id: 1,
      nickname: 'test',
      email: 'test@test.com',
      password: 'password',
      createdAt: new Date(),
      deletedAt: null,
      members: [],
    };
    const workspaceId = 1;
    const addWorkspaceMemberDto: AddWorkspaceMemberDto = { userId: [1] };
    const returnValue = { status: 201, message: '멤버를 성공적으로 초대했습니다.' };
    (workspaceService.addWorkspaceMember as jest.Mock).mockReturnValue(returnValue);
    // 서비스 에서 addworkspaceMember호출될때 값 모킹

    const result = await workspaceController.addWorkspaceMember(
      //컨트롤러에서 서비스 addworkspaceMember호출
      user,
      workspaceId,
      addWorkspaceMemberDto,
    );
    expect(result).toEqual(returnValue);
    expect(workspaceService.addWorkspaceMember).toHaveBeenCalledWith(
      user,
      workspaceId,
      addWorkspaceMemberDto.userId,
    );
  });
});
