import { Body, Controller, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { InviteMemberDto } from './dto/invite-member.dto';
// @UseGuards(RolesGuard)
@Controller('workspaces')
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @Get()
  async findAll() {
    return await this.workspaceService.getAllWorkspace();
  }

  @Get(':workspaceId')
  async findOne(@Param('workspaceId') workspaceId: number) {
    return await this.workspaceService.getWorkspaceById(workspaceId);
  }

  @Post()
  async workspaceCreate(@Body() createWorkspaceDto: CreateWorkspaceDto) {
    return await this.workspaceService.workspaceCreate(createWorkspaceDto);
  }

  @Put(':workspaceId/members')
  async inviteMembers(
    @Param('workspaceId') workspaceId: number,
    @Body() inviteMemberDto: InviteMemberDto,
  ) {
    return await this.workspaceService.inviteMembers(workspaceId, inviteMemberDto);
  }
}
