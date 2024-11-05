import { Test, TestingModule } from '@nestjs/testing';
import { WorkspaceController } from './workspace.controller';
import { WorkspaceService } from './workspace.service';
import { InviteMemberDto } from './dto/invite-member.dto';

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
    }).compile();
    workspaceController = module.get<WorkspaceController>(WorkspaceController);
    workspaceService = module.get<WorkspaceService>(WorkspaceService);
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
  it('워크스페이스 컨트롤러 상세 조회 테스트', async () => {
    const workspaceId = 1;
    const workspace = [
      {
        workspaceId: 1,
        workspaceName: 'string',
        createdAt: new Date(),
      },
      {
        workspaceId: 2,
        workspaceName: 'string',
        createdAt: new Date(),
      },
    ];
    (workspaceService.getWorkspaceById as jest.Mock).mockResolvedValue(workspace);
    const workspace1 = await workspaceController.findOne(workspaceId);
    expect(workspace1).toEqual(workspace);
    expect(workspaceService.getWorkspaceById).toHaveBeenCalled();
  });

  it('워크스페이스 컨트롤러 생성 테스트 ', async () => {
    const createDto = { workspaceName: 'string' };
    const createWorkspace = {
      workspaceId: 1,
      workspaceName: 'string',
      createdAt: new Date('2024-12-24'),
    };
    (workspaceService.workspaceCreate as jest.Mock).mockResolvedValue(createWorkspace);
    const result = await workspaceController.workspaceCreate(createDto);
    expect(result).toEqual({
      workspaceId: 1,
      workspaceName: 'string',
      createdAt: new Date('2024-12-24'),
    });
    expect(workspaceService.workspaceCreate).toHaveBeenCalledWith(createDto);
  });

  it('워크스페이스 컨트롤러 멤버 초대 테스트', async () => {
    const workspaceId = 1;
    const inviteMemberDto = { userId: [1] };
    const inviteMember = {
      message: '멤버를 초대하였습니다.',
    };
    (workspaceService.inviteMembers as jest.Mock).mockResolvedValue(inviteMember);
    const result = await workspaceController.inviteMembers(workspaceId, inviteMemberDto);
    expect(workspaceService.inviteMembers).toHaveBeenCalledWith(workspaceId, inviteMemberDto);
    expect(result).toEqual(inviteMember);
  });
});
