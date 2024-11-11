import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import _ from 'lodash';
import { MemberEntity } from 'src/member/entity/member.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { MailService } from '../auth/email/email.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { WorkspaceEntity } from './entities/workspace.entity';

@Injectable()
export class WorkspaceService {
  constructor(
    @InjectRepository(WorkspaceEntity)
    private workspaceRepository: Repository<WorkspaceEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(MemberEntity)
    private readonly memberRepository: Repository<MemberEntity>,
    private readonly mailerService: MailService,
  ) {}

  async workspaceCreate(
    user: UserEntity,
    createWorkspaceDto: CreateWorkspaceDto,
  ): Promise<WorkspaceEntity> {
    const { workspaceName } = createWorkspaceDto;
    const userId = user.id;
    const newWorkspace = await this.workspaceRepository.create({ workspaceName, userId });

    try {
      const saveWorkspace = await this.workspaceRepository.save(newWorkspace);

      await this.addAdminMember(user, saveWorkspace);

      return saveWorkspace;
    } catch (err) {
      throw err;
    }
  }

  private async addAdminMember(user: UserEntity, workspace: WorkspaceEntity) {
    const createMember = await this.memberRepository.create({
      isAdmin: true,
      user,
      workspace,
    });

    try {
      await this.memberRepository.save(createMember);
    } catch (err) {
      throw err;
    }
  }

  async getAllWorkspace(): Promise<WorkspaceEntity[]> {
    const getWorkspace = (await this.workspaceRepository.find()) || [];
    if (getWorkspace.length === 0) {
      throw new BadRequestException('등록된 워크스페이스가 없습니다.');
    }
    try {
      return getWorkspace;
    } catch (err) {
      throw err;
    }
  }

  async getWorkspaceById(workspaceId: number) {
    try {
      const getOneWorkspace = await this.foundWorkspaceById(workspaceId);
      return getOneWorkspace;
    } catch (err) {
      throw err;
    }
  }

  async addWorkspaceMember(
    user: UserEntity,
    workspaceId: number,
    userIds: number[],
  ): Promise<{ message: string }> {
    try {
      const foundWorkspace = await this.foundWorkspaceById(workspaceId);
      await this.verifyAdminPrivileges(user, workspaceId);
      const inviteMember = await this.addMembersToWorkspace(foundWorkspace, userIds);

      await this.sendInvetationEmail(userIds);

      return { message: '멤버를 성공적으로 초대했습니다.' };
    } catch (err) {
      throw err;
    }
  }
  private async sendInvetationEmail(userIds: number[]) {
    for (const id of userIds) {
      const foundEmailByUserId = await this.userRepository.findOne({
        where: { id },
        select: { email: true },
      });
      const email = foundEmailByUserId.email;
      await this.mailerService.sendMemberEmail(email);
    }
  }

  private async foundWorkspaceById(workspaceId: number) {
    const workspace = await this.workspaceRepository.findOne({
      where: { id: workspaceId },
      relations: { members: true },
    });
    if (_.isNil(workspace)) {
      throw new NotFoundException('워크스페이스ID가 존재하지 않습니다.');
    }
    return workspace;
  }

  private async verifyAdminPrivileges(user: UserEntity, workspaceId: number) {
    const foundAdminMember = await this.memberRepository.findOne({
      where: { workspace: { id: workspaceId }, user: { id: user.id }, isAdmin: true },
    });

    if (!foundAdminMember) {
      throw new ForbiddenException(`해당 워크스페이스에 멤버를 추가할 권한이 없습니다.`);
    }
  }

  private async addMembersToWorkspace(workspace: WorkspaceEntity, userIds: number[]) {
    for (const userId of userIds) {
      const foundUser = await this.foundUserById(userId);
      await this.checkDuplicateMember(workspace.id, userId);

      const newMember = this.memberRepository.create({
        isAdmin: false,
        user: foundUser,
        workspace,
      });
      await this.memberRepository.save(newMember);
    }
  }

  private async foundUserById(userId: number): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`ID(${userId})의 사용자가 존재하지 않습니다.`);
    }
    return user;
  }

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
