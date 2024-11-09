import { Injectable } from '@nestjs/common';
import { RedisService } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';

@Injectable()
export class NotificationService {
  private readonly redisClient;

  constructor(private readonly redisService: RedisService) {
    this.redisClient = this.redisService.getOrThrow();
  }

  async sendNotification(userId: number, message: string): Promise<string> {
    const streamKey = `notifications:user:${userId}`;
    const notificationId = await this.redisClient.xadd(
      streamKey,
      '*',
      'message',
      message,
      'timestamp',
      new Date().toISOString(),
    );
    console.log(`Notification added to stream: ${notificationId}`);
    return notificationId;
  }

  // 스트림에서 알림 가져오기(알림 읽기)
  async getNotifications(userId: number, lastId = '$'): Promise<any[]> {
    const streamKey = `notifications:user:${userId}`;
    const messages = await this.redisClient.xrange(streamKey, lastId, '+');
    return messages.map(([id, fields]) => ({
      id,
      ...Object.fromEntries(fields),
    }));
  }
}
