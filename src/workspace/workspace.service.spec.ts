import { Test, TestingModule } from '@nestjs/testing';
import { WorkspaceService } from './workspace.service';
import { WorkspaceEntity } from './entities/workspace.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('WorkspaceService', () => {
  let workspaceService: WorkspaceService;
  let workspaceRepository: any; // 모킹된 리포지토리

  beforeEach(async () => {
    // 모킹된 리포지토리 생성
    const mockRepository = {
      create: jest.fn().mockReturnValue({}), // 빈 객체 또는 모킹된 WorkspaceEntity 반환
      save: jest.fn().mockResolvedValue({ id: 1, workspaceName: 'test workspace' }), // 모킹된 저장된 엔티티 반환
      findOne: jest.fn().mockResolvedValue({
        workspaceId: 1,
        workspaceName: 'testName',
        createdAt: '2024-12-24',
        members: [{ name: 'test', isAdmin: true }],
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkspaceService,
        {
          provide: getRepositoryToken(WorkspaceEntity),
          useValue: mockRepository, // 모킹된 리포지토리 사용
        },
      ],
    }).compile();

    // 서비스와 모킹된 리포지토리 가져오기
    workspaceService = module.get<WorkspaceService>(WorkspaceService);
    workspaceRepository = module.get(getRepositoryToken(WorkspaceEntity)); // 모킹된 리포지토리 가져오기
  });

  /**요구 사항 정의
   * 워크스페이스 이름을 입력받아 새로운 워크스페이스를 생성
   * 생성된 워크스페이스는 db에 저장
   * 성곡적으로 생성되면 / 워크스페이스 정보를 반환
   */
  it('워크스페이스 생성 테스트', async () => {
    const createWorkspaceDto = { workspaceName: 'test workspace' };
    const result: WorkspaceEntity = await workspaceService.workspaceCreate(createWorkspaceDto);

    expect(workspaceRepository.save).toHaveBeenCalled();
    // 결과가 올바른지 확인
    expect(result).toEqual({ workspaceName: 'test workspace' });
    expect(result).toEqual({ createdAt: '2024-11-05T12:00:00.000Z' });
  });
});
