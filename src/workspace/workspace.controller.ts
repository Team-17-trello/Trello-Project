import { Body, Controller, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserInfo } from 'src/utils/userInfo-decolator';
import { AddWorkspaceMemberDto } from './dto/add-workspace-member.dto';
import { MemberGuard } from '../guard/members.guard';

// UseGuards(AuthGuard('jwt'));
@Controller('workspaces')
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @UseGuards(MemberGuard)
  @Get(':workspaceId')
  async findOne(@Param('workspaceId') workspaceId: number) {
    return await this.workspaceService.getWorkspaceById(workspaceId);
  }

  @Get()
  async findAll() {
    return await this.workspaceService.getAllWorkspace();
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async workspaceCreate(
    @UserInfo() user: UserEntity,
    @Body() createWorkspaceDto: CreateWorkspaceDto,
  ) {
    return await this.workspaceService.workspaceCreate(user, createWorkspaceDto);
  }

  @UseGuards(MemberGuard) // 해당 워크스페이스 멤버인지 확인
  @Put(':workspaceId/members') // workspaceId를 URL 파라미터로 받음
  async addWorkspaceMember(
    @UserInfo() user: UserEntity, // @UserInfo() 데코레이터를 통해 현재 유저 정보 가져오기
    @Param('workspaceId') workspaceId: number, // URL에서 workspaceId 추출
    @Body() addWorkspaceMemberDto: AddWorkspaceMemberDto, // DTO를 통해 유저 정보 받기
  ) {
    // 서비스의 addWorkspaceMember 메서드 호출
    return await this.workspaceService.addWorkspaceMember(
      user,
      workspaceId,
      addWorkspaceMemberDto.userId, // DTO에서 userId를 추출
    );
  }
}
