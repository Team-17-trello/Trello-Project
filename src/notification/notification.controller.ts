import { Controller, Post, Body, Get, Param, Query } from '@nestjs/common';
import { NotificationService } from './notification.service';
@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  //   @Post()
  //   sendNotification(@Body() body: { userId: number; message: string }) {
  //     const notificationId = await this.notificationService.sendNotification(
  //       body.userId,
  //       body.message,
  //     );
  //     return { notificationId };
  //   }
}
