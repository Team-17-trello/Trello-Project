import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WorkspaceEntity } from './entities/workspace.entity';
import { Repository } from 'typeorm';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import _ from 'lodash';
import { InviteMemberDto } from './dto/invite-member.dto';

@Injectable()
export class WorkspaceService {
  constructor(
    @InjectRepository(WorkspaceEntity)
    private workspaceRepository: Repository<WorkspaceEntity>,
  ) {}

  /**워크스페이스 생성 */
  async workspaceCreate(createWorkspaceDto: CreateWorkspaceDto): Promise<WorkspaceEntity> {
    const { workspaceName } = createWorkspaceDto;

    // 새로운 워크스페이스 생성
    const newWorkspace = this.workspaceRepository.create({ workspaceName });

    try {
      return await this.workspaceRepository.save(newWorkspace);
    } catch (error) {
      throw new BadRequestException('워크스페이스 생성 중 오류가 발생했습니다.');
    }
  }

  /**워크스페이스 전체 조회 */
  async getAllWorkspace(): Promise<WorkspaceEntity[]> {
    const getWorkspace = await this.workspaceRepository.find();

    if (getWorkspace.length === 0) {
      throw new BadRequestException('등록된 워크스페이스가 없습니다.');
    }

    return getWorkspace;
  }

  /**워크스페이스 상세 조회 */
  async getWorkspaceById(workspaceId: number) {
    await this.verifyWorkspaceById(workspaceId);
    const getOneWorkspace = await this.workspaceRepository.findOne({
      where: { id: workspaceId },
      // relations: {}, //TODO:members 들어가야됌, select:{userId,name,isAdmin}
    });
    return getOneWorkspace;
  }

  /**워크스페이스 멤버 초대 */
  // async addWorkspaceMember(id: number, memberId: number): Promise<WorkspaceEntity> {
  //   /**
  //    * 초대할 유저의 id가 User테이블에 실제로 존재하는 user인지 검사
  //    *
  //    * 초대할 유저 id를 워크스페이스의 members[]에 추가
  //    * 멤버가 추가된 워크스페이스의 정보 리던
  //    */

  //   const 임시유저db = {
  //     userId: 2,
  //     name: 'kim',
  //     isAdmin: 'false',
  //   };

  //   // const foundUser = await this.userRepository.findOne({ where: { id } })//나중에 유저디비랑 연결해서 사용
  //   const { userId, name, isAdmin } = 임시유저db;

  //   if (!foundUser) {
  //     throw new NotFoundException(`해당 ID(${userId})의 사용자가 존재하지 않습니다.`);
  //   }

  //   const foundWorkspace = await this.workspaceRepository.findOne({
  //     where: { id },
  //     relations: ['members'],
  //   });

  //   if (!foundWorkspace) {
  //     throw new NotFoundException(`해당 ID(${id})의 워크스페이스가 존재하지 않습니다.`);
  //   }

  //   foundWorkspace.members.push();
  //   console.log(foundUser);

  //   await this.workspaceRepository.save(foundWorkspace);
  //   return foundWorkspace;
  // }

  async inviteMembers(
    workspaceId: number,
    inviteMemberDto: InviteMemberDto,
  ): Promise<WorkspaceEntity> {
    const { userId } = inviteMemberDto;
    return;
  }

  private async verifyWorkspaceById(workspaceId: number) {
    const workspace = await this.workspaceRepository.findOneBy({ id: workspaceId });
    if (_.isNil(workspace)) {
      throw new BadRequestException('존재하지 않는 워크스페이스 입니다.');
    }
    return workspace;
  }
}
