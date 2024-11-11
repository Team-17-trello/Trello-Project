import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserInfo } from 'src/utils/userInfo-decolator';
import { MemberGuard } from '../guard/members.guard';
import { AddWorkspaceMemberDto } from './dto/add-workspace-member.dto';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { WorkspaceService } from './workspace.service';

UseGuards(AuthGuard('jwt'));
@ApiBearerAuth()
@ApiTags('워크 스페이스')
@Controller('workspaces')
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @UseGuards(MemberGuard)
  @Get(':workspaceId')
  @ApiOperation({ summary: '워크 스페이스 상세 조회' })
  @ApiResponse({
    status: 200,
    description: '워크 스페이스가 성공적으로 조회되었습니다',
  })
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('workspaceId') workspaceId: number) {
    return await this.workspaceService.getWorkspaceById(workspaceId);
  }

  @Get()
  @ApiOperation({ summary: '워크 스페이스 목록 조회' })
  @ApiResponse({
    status: 200,
    description: '워크 스페이스가 성공적으로 조회되었습니다',
  })
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return await this.workspaceService.getAllWorkspace();
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @ApiOperation({ summary: '워크 스페이스 생성' })
  @ApiResponse({
    status: 200,
    description: '워크 스페이스가 성공적으로 생성되었습니다',
    type: CreateWorkspaceDto,
  })
  @HttpCode(HttpStatus.CREATED)
  async workspaceCreate(
    @UserInfo() user: UserEntity,
    @Body() createWorkspaceDto: CreateWorkspaceDto,
  ) {
    return await this.workspaceService.workspaceCreate(user, createWorkspaceDto);
  }

  @UseGuards(MemberGuard)
  @Put(':workspaceId/members')
  @ApiOperation({ summary: '멤버 초대' })
  @ApiResponse({
    status: 200,
    description: '멤버를 성공적으로 초대 하였습니다',
    type: AddWorkspaceMemberDto,
  })
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
