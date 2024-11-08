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
    // 새로운 워크스페이스 생성
    const newWorkspace = this.workspaceRepository.create({
      workspaceName: createWorkspaceDto.workspaceName,
      userId: user.id,
    });

    try {
      const saveWorkspace = await this.workspaceRepository.save(newWorkspace);

      const createMember = this.memberRepository.create({
        isAdmin: true,
        user,
        workspace: saveWorkspace,
      });

      await this.memberRepository.save(createMember);

      return saveWorkspace;
    } catch (error) {
      throw new BadRequestException('워크스페이스 생성 중 오류가 발생했습니다.');
    }
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
    userId: number[],
  ): Promise<{ status: number; message: string }> {
    // 2. 멤버를 추가하려는 워크스페이스가 DB에 존재하는가?
    const foundWorkspace = await this.workspaceRepository.findOne({
      where: { id: workspaceId },
      relations: ['members'],
    });

    if (!foundWorkspace) {
      throw new NotFoundException(`해당 ID(${workspaceId})의 워크스페이스가 존재하지 않습니다.`);
    }

    // 3. 해당 워크스페이스에 멤버를 추가할 권한이 있는가? (isAdmin 확인)
    const foundAdminMember = await this.memberRepository.findOne({
      where: { workspace: { id: workspaceId }, user: { id: user.id }, isAdmin: true },
    });
    if (!foundAdminMember) {
      throw new ForbiddenException(`해당 워크스페이스에 멤버를 추가할 권한이 없습니다.`);
    }

    for (let i = 0; i < userId.length; i++) {
      // 1. 멤버로 추가하려는 유저가 User 테이블에 존재하는가?
      const foundUser = await this.userRepository.findOne({ where: { id: userId[i] } });
      if (!foundUser) {
        throw new NotFoundException(`해당 ID(${userId})의 사용자가 존재하지 않습니다.`);
      }

      const inviteMember = await this.memberRepository.findOne({
        where: {
          workspace: { id: workspaceId },
          user: { id: userId[i] },
        },
      });
      if (inviteMember) {
        throw new ConflictException(`유저${userId}가 이미 초대되었습니다.`);
      }

      const createMember = this.memberRepository.create({
        isAdmin: false,
        user: foundUser,
        workspace: foundWorkspace,
      });
      await this.memberRepository.save(createMember);
    }

    return { status: 201, message: '멤버를 성공적으로 초대했습니다.' };
  }

  async verifyWorkspaceById(workspaceId: number) {
    const workspace = await this.workspaceRepository.findOne({
      where: { id: workspaceId },
      relations: { members: true },
    });
    if (_.isNil(workspace)) {
      throw new BadRequestException('존재하지 않는 워크스페이스 입니다.');
    }
    return workspace;
  }
}
