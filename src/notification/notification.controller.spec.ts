import { Test, TestingModule } from '@nestjs/testing';
import { UserEntity } from 'src/user/entities/user.entity';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';

describe('NotificationController', () => {
  let notificationController: NotificationController;
  let notificationService: NotificationService;

  const mockNotificationService = {
    getNotifications: jest.fn(),
  };

  const mockUser: UserEntity = {
    id: 1,
    email: 'Test@example.com',
    password: 'Test password',
    nickname: 'Testname',
    createdAt: new Date(),
    deletedAt: null,
    members: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationController],
      providers: [
        {
          provide: NotificationService,
          useValue: mockNotificationService,
        },
      ],
    }).compile();

    notificationController = module.get<NotificationController>(NotificationController);
    notificationService = module.get<NotificationService>(NotificationService);
  });

  it('should be defined', () => {
    expect(notificationController).toBeDefined();
  });

  it('보드 목록 조회', async () => {
    const notifications = [{ id: 1, message: 'Test Notification' }];
    mockNotificationService.getNotifications.mockResolvedValue(notifications);

    const result = await notificationController.findAll(mockUser);

    expect(result).toEqual(notifications);
    expect(mockNotificationService.getNotifications).toHaveBeenCalledWith(mockUser);
  });
});
