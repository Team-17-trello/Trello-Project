import { Controller, HttpCode, HttpStatus, Param, Patch, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserEntity } from '../user/entities/user.entity';
import { UserInfo } from '../utils/userInfo-decolator';
import { MemberService } from './member.service';

@ApiBearerAuth()
@ApiTags('멤버')
@UseGuards(AuthGuard('jwt'))
@Controller('members')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Patch(':workspaceId/:userId')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: '멤버 변경' })
  @ApiResponse({ status: 200, description: '멤버가 성공적으로 변경됨' })
  switch(
    @UserInfo() user: UserEntity,
    @Param('workspaceId') workspaceId: string,
    @Param('userId') userId: string,
  ) {
    return this.memberService.switch(user, +workspaceId, +userId);
  }
}
