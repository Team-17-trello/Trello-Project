import { Test, TestingModule } from '@nestjs/testing';
import { WorkspaceService } from './workspace.service';
import { WorkspaceEntity } from './entities/workspace.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common';

describe('WorkspaceService', () => {
  let workspaceService: WorkspaceService;
  let workspaceRepository: Repository<WorkspaceEntity>; // 모킹된 리포지토리

  beforeEach(async () => {
    // 모킹된 리포지토리 생성
    const mockRepository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
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
    workspaceRepository = module.get<Repository<WorkspaceEntity>>(
      getRepositoryToken(WorkspaceEntity),
    ); // 모킹된 리포지토리 가져오기
  });

  it('워크스페이스 생성 테스트', async () => {
    const createWorkspaceDto = { workspaceName: 'test workspace' };
    const newWorkspace = { id: 1, workspaceName: 'test workspace', createdAt: new Date() };

    workspaceRepository.create = jest.fn().mockReturnValue(newWorkspace);
    workspaceRepository.save = jest.fn().mockResolvedValue(newWorkspace);

    const result = await workspaceService.workspaceCreate(createWorkspaceDto);
    expect(workspaceRepository.create).toHaveBeenCalledWith(createWorkspaceDto);
    expect(workspaceRepository.save).toHaveBeenCalledWith(newWorkspace);
    expect(result).toEqual(newWorkspace);
  });

  it('워크스페이스 조회 테스트', async () => {
    const workspace = [{ id: 1, workspaceName: 'test', craetedAt: new Date() }];
    workspaceRepository.find = jest.fn().mockReturnValue(workspace);

    const result = await workspaceService.getAllWorkspace();
    console.log(result);
    expect(workspaceRepository.find).toHaveBeenCalled();
    expect(result).toEqual(workspace);
  });

  it('워크스페이스 조회 실패 테스트', async () => {
    await expect(workspaceService.getAllWorkspace()).rejects.toThrow(BadRequestException);
  });

  it('워크스페이스 상세 조회 테스트', async () => {
    const workspace = { id: 1, workspaceName: 'test', createdAt: new Date() };
    workspaceRepository.findOne = jest.fn().mockReturnValue(workspace);

    const result = await workspaceService.getWorkspaceById(1);
    expect(workspaceRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(result).toEqual(workspace);
  });
});
