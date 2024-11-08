import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserInfo } from 'src/utils/userInfo-decolator';
import { AddWorkspaceMemberDto } from './dto/add-workspace-member.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

UseGuards(AuthGuard('jwt'));
@ApiBearerAuth()
@Controller('workspaces')
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @Get(':workspaceId')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('workspaceId') workspaceId: number) {
    return await this.workspaceService.getWorkspaceById(workspaceId);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return await this.workspaceService.getAllWorkspace();
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async workspaceCreate(
    @UserInfo() user: UserEntity,
    @Body() createWorkspaceDto: CreateWorkspaceDto,
  ) {
    return await this.workspaceService.workspaceCreate(user, createWorkspaceDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':workspaceId/members')
  @HttpCode(HttpStatus.OK)
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
