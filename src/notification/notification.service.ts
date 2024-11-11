import { RedisService } from '@liaoliaots/nestjs-redis';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class NotificationService {
  private readonly redisClient;

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly redisService: RedisService,
  ) {
    this.redisClient = this.redisService.getOrThrow();
  }

  async sendNotification(userId: number, message: string): Promise<string> {
    try {
      const findUser = await this.userRepository.findOne({
        where: { id: userId },
      });
      if (!findUser) {
        throw new NotFoundException('해당 사용자가 없습니다.');
      }
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
    } catch (err) {
      throw err;
    }
  }

  // 스트림에서 알림 가져오기(알림 읽기)
  async getNotifications(user: UserEntity): Promise<any[]> {
    try {
      const findUser = await this.userRepository.findOne({
        where: { id: user.id },
      });
      if (!findUser) {
        throw new NotFoundException('해당 사용자가 없습니다.');
      }

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
