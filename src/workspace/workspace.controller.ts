import { Body, Controller, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserInfo } from 'src/utils/userInfo-decolator';
import { AddWorkspaceMemberDto } from './dto/add-workspace-member.dto';

@Controller('workspaces')
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

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

  @UseGuards(AuthGuard('jwt'))
  @Put(':workspaceId/members')
  async addWorkspaceMember(
    @UserInfo() user: UserEntity,
    @Param('workspaceId') workspaceId: number,
    @Body() addWorkspaceMemberDto: AddWorkspaceMemberDto,
  ) {
    return await this.workspaceService.addWorkspaceMember(
      user,
      workspaceId,
      addWorkspaceMemberDto.userId,
    );
  }
}
