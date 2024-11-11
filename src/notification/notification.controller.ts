import { Controller, Get, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MemberGuard } from 'src/guard/members.guard';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserInfo } from 'src/utils/userInfo-decolator';
import { NotificationService } from './notification.service';

@ApiTags('알림')
@UseGuards(MemberGuard)
@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  @ApiOperation({ summary: '알림 보기' })
  @ApiResponse({ status: 200, description: '알림이 성공적으로 조회됨' })
  @HttpCode(HttpStatus.OK)
  findAll(@UserInfo() user: UserEntity) {
    return this.notificationService.getNotifications(user);
  }
}
