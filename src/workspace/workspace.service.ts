import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WorkspaceEntity } from './entities/workspace.entity';
import { Repository } from 'typeorm';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import _ from 'lodash';
import { MemberEntity } from 'src/member/entity/member.entity';
import { UserEntity } from 'src/user/entities/user.entity';

@Injectable()
export class WorkspaceService {
  constructor(
    @InjectRepository(WorkspaceEntity)
    private workspaceRepository: Repository<WorkspaceEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(MemberEntity)
    private readonly memberRepository: Repository<MemberEntity>,
  ) {}

  /**워크스페이스 생성 */
  async workspaceCreate(
    user: UserEntity,
    createWorkspaceDto: CreateWorkspaceDto,
  ): Promise<WorkspaceEntity> {
    const { workspaceName } = createWorkspaceDto;
    const userId = user.id;
    const newWorkspace = await this.workspaceRepository.create({ workspaceName, userId });

    try {
      const saveWorkspace = await this.workspaceRepository.save(newWorkspace);

      await this.addAdminMember(user, saveWorkspace); //<-별도로 만든 함수 사용

      return saveWorkspace;
    } catch (error) {
      throw new BadRequestException('워크스페이스 생성 중 오류가 발생했습니다.');
    }
  }

  //admin 멤버를 추가하는 로직 함수 <- 위의 "워크스페이스 생성" 로직의 가동성과 재사용성 강화했습니다.
  private async addAdminMember(user: UserEntity, workspace: WorkspaceEntity) {
    const createMember = await this.memberRepository.create({
      isAdmin: true,
      user,
      workspace,
    });
    await this.memberRepository.save(createMember);
  }

  /**워크스페이스 전체 조회 */
  async getAllWorkspace(): Promise<WorkspaceEntity[]> {
    const getWorkspace = (await this.workspaceRepository.find()) || [];

    if (getWorkspace.length === 0) {
      throw new BadRequestException('등록된 워크스페이스가 없습니다.');
    }

    return getWorkspace;
  }

  /**워크스페이스 상세 조회 */
  async getWorkspaceById(workspaceId: number) {
    await this.verifyWorkspaceById(workspaceId);
    const getOneWorkspace = await this.workspaceRepository.find({
      where: { id: workspaceId },
      relations: { members: { user: true } },
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
    });

    return getOneWorkspace;
  }

  /** 워크스페이스 멤버 초대 */
  async addWorkspaceMember(
    user: UserEntity,
    workspaceId: number,
    userIds: number[],
  ): Promise<{ status: number; message: string }> {
    const foundWorkspace = await this.verifyWorkspaceById(workspaceId); //워크스페이스id로 워스크페이스 존재여부 확인
    await this.verifyAdminPrivileges(user, workspaceId); //user가 워크스페이스의 어드민 권한이 있는지 확인
    await this.addMembersToWorspace(foundWorkspace, userIds); //해당 워크스페이스에 userIds배열에 있는 모든 유저 추가
    return { status: 201, message: '멤버를 성공적으로 초대했습니다.' };
  }

  //워크스페이스 존재 여부 확인 함수
  private async verifyWorkspaceById(workspaceId: number) {
    const workspace = await this.workspaceRepository.findOne({
      where: { id: workspaceId },
      relations: { members: true },
    });
    if (_.isNil(workspace)) {
      throw new BadRequestException('존재하지 않는 워크스페이스 입니다.');
    }
    return workspace;
  }

  //verifyAdminPrivileges(어드민 권한 확인)함수
  //별도의 유틸파일로 이사 예정
  private async verifyAdminPrivileges(user: UserEntity, workspaceId: number) {
    const foundAdminMember = await this.memberRepository.findOne({
      where: { workspace: { id: workspaceId }, user: { id: user.id }, isAdmin: true },
    });
    if (!foundAdminMember) {
      throw new ForbiddenException(`해당 워크스페이스에 멤버를 추가할 권한이 없습니다.`);
    }
  }

  //멤버 추가 함수
  private async addMembersToWorspace(workspace: WorkspaceEntity, userIds: number[]) {
    for (const userId of userIds) {
      const foundUser = await this.verifyUserById(userId);
      await this.checkDuplicateMember(workspace.id, userId);

      const newMember = this.memberRepository.create({
        isAdmin: false,
        user: foundUser,
        workspace,
      });
      await this.memberRepository.save(newMember);
    }
  }

  //유저 존재 여부 확인 함수
  private async verifyUserById(userId: number): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`ID(${userId})의 사용자가 존재하지 않습니다.`);
    }
    return user;
  }

  //중복 멤버 확인 함수
  private async checkDuplicateMember(workspaceId: number, userId: number) {
    const existingMember = await this.memberRepository.findOne({
      where: {
        workspace: { id: workspaceId },
        user: { id: userId },
      },
    });
    if (existingMember) {
      throw new ConflictException(`유저(${userId})가 이미 초대되었습니다.`);
    }
  }
}
