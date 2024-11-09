import { Injectable } from '@nestjs/common';
import { RedisService } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
import { UserEntity } from 'src/user/entities/user.entity';

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
  async getNotifications(user: UserEntity): Promise<any[]> {
    try {
      const streamKey = `notifications:user:${user.id}`;
      const messages = await this.redisClient.xrange(streamKey, '-', '+');

      void this.removeNotifications(user);

      return messages;
    } catch (err) {
      throw err;
    }
  }

  async removeNotifications(user: UserEntity) {
    const streamKey = `notifications:user:${user.id}`;
    await this.redisClient.del(streamKey);
  }
}
