import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserInfo } from 'src/utils/userInfo-decolator';
import { UserEntity } from 'src/user/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: '알림 보기' })
  @ApiResponse({ status: 200, description: '알림이 성공적으로 생성됨' })
  @HttpCode(HttpStatus.OK)
  findAll(@UserInfo() user: UserEntity) {
    return this.notificationService.getNotifications(user);
  }
}
