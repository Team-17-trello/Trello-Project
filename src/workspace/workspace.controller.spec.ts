import { Test, TestingModule } from '@nestjs/testing';
import { WorkspaceController } from './workspace.controller';
import { WorkspaceService } from './workspace.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/user/entities/user.entity';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { pull } from 'lodash';

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
            inviteMembers: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(AuthGuard('jwt'))
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
    //   const user: User = { id: 1, nickname: 'test'};
    //   const createDto = { workspaceName: 'string' };
    //   const createWorkspace = {
    //     id: 1,
    //     workspaceName: 'string',
    //     createdAt: new Date(),
    //   };
    //   (workspaceService.workspaceCreate as jest.Mock).mockResolvedValue(createWorkspace);
    //   const result = await workspaceController.workspaceCreate(user, createDto);
    //   expect(result).toEqual({
    //     workspaceId: 1,
    //     workspaceName: 'string',
    //     createdAt: new Date('2024-12-24'),
    //   });
    //   expect(workspaceService.workspaceCreate).toHaveBeenCalledWith(createDto);
    // });
    const user = { id: 1, email: 'qwer@qwer',}; // 기본 user 객체
    const createWorkspaceDto: CreateWorkspaceDto = { workspaceName: 'Test Workspace' };
    const expectedResult = { id: 1, workspaceName: 'Test Workspace', createdAt: new Date() };

    // 서비스의 메서드 모킹
    (workspaceService.workspaceCreate as jest.Mock).mockResolvedValue(expectedResult);

    // 메서드 호출 및 결과 검증
    const result = await workspaceController.workspaceCreate(user, createWorkspaceDto);

    expect(workspaceService.workspaceCreate).toHaveBeenCalledWith(user, createWorkspaceDto);
    expect(result).toEqual(expectedResult);
  });

  // it('워크스페이스 컨트롤러 멤버 초대 테스트', async () => {
  //   const workspaceId = 1;
  //   const inviteMemberDto = { userId: [1] };
  //   const inviteMember = {
  //     message: '멤버를 초대하였습니다.',
  //   };
  //   (workspaceService.inviteMembers as jest.Mock).mockResolvedValue(inviteMember);
  //   const result = await workspaceController.inviteMembers(workspaceId, inviteMemberDto);
  //   expect(workspaceService.inviteMembers).toHaveBeenCalledWith(workspaceId, inviteMemberDto);
  //   expect(result).toEqual(inviteMember);
  // });
});
