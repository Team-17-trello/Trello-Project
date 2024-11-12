import { RedisService } from '@liaoliaots/nestjs-redis';
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entities/user.entity';
import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let notificatinService: NotificationService;
  let mockRedisClient: any;
  let redisService: RedisService;
  let mockUserRepository: any;

  mockRedisClient = {
    xadd: jest.fn(),
    xrange: jest.fn(),
    del: jest.fn(),
  };

  mockUserRepository = {
    findOne: jest.fn(),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationService,
        {
          provide: RedisService,
          useValue: {
            getOrThrow: jest.fn(() => mockRedisClient),
          },
        },
        {
          provide: getRepositoryToken(UserEntity),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    notificatinService = module.get<NotificationService>(NotificationService);
    redisService = module.get<RedisService>(RedisService);
  });

  it('should be defined', () => {
    expect(notificatinService).toBeDefined();
  });

  const userId = 1;
  const message = '메세지 입니다.';
  const notificationId = '123';
  const streamKey = `notifications:user:${userId}`;
  const user: UserEntity = {
    id: 1,
    email: 'test@test.com',
    password: 'test1234',
    nickname: 'tester',
    createdAt: new Date(),
    deletedAt: null,
    members: null,
  };

  describe('sendNotification', () => {
    it('알림 전송 성공 검증', async () => {
      const fixedDate = new Date('2024-11-10T01:38:22.693Z');
      jest.spyOn(global, 'Date').mockImplementationOnce(() => fixedDate);
      mockUserRepository.findOne.mockResolvedValue({ id: userId });
      mockRedisClient.xadd.mockResolvedValue(notificationId);
      const result = await notificatinService.sendNotification(userId, message);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { id: userId } });
      expect(mockRedisClient.xadd).toHaveBeenCalledWith(
        streamKey,
        '*',
        'message',
        message,
        'timestamp',
        fixedDate.toISOString(),
      );
      expect(result).toBe(notificationId);
    });

    it('해당 사용자가 없을 시 NotfoundException 반환', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);
      expect(notificatinService.sendNotification(1, message)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getNotifications', () => {
    it('알림 조회 성공 검증', async () => {
      mockUserRepository.findOne.mockResolvedValue({ id: 1 });
      const messages = [];

      mockRedisClient.xrange.mockResolvedValue(messages);
      const result = await notificatinService.getNotifications(user);

      expect(mockRedisClient.xrange).toHaveBeenCalledWith(streamKey, '-', '+');
      expect(mockRedisClient.del).toHaveBeenCalledWith(streamKey);
      expect(result).toBe(messages);
    });

    it('해당 사용자가 없을 시 NotfoundException 반환', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);
      expect(notificatinService.getNotifications(user)).rejects.toThrow(NotFoundException);
    });
  });

  describe('removeNotifications', () => {
    it('레디스에 저장된 데이터 삭제 검증', async () => {
      await notificatinService.removeNotifications(user);

      expect(mockRedisClient.del).toHaveBeenCalledWith(streamKey);
    });
  });
});
