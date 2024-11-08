import { Controller, Param, Patch, UseGuards } from '@nestjs/common';
import { MemberService } from './member.service';
import { AuthGuard } from '@nestjs/passport';
import { UserInfo } from '../utils/userInfo-decolator';
import { UserEntity } from '../user/entities/user.entity';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('members')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Patch(':workspaceId/:userId')
  switch(
    @UserInfo() user: UserEntity,
    @Param('workspaceId') workspaceId: string,
    @Param('userId') userId: string,
  ) {
    return this.memberService.switch(user, +workspaceId, +userId);
  }
}
