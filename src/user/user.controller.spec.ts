import { Test, TestingModule } from '@nestjs/testing';
import { RemoveUserDto } from './dto/remove.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });
  const mockUser: UserEntity = {
    id: 1,
    email: 'test@test.com',
    password: 'test1234',
    nickname: 'tester',
    createdAt: new Date(),
    deletedAt: null,
    members: null,
  };

  describe('update', () => {
    it('update 메소드를 실행하고 결과를 반환', async () => {
      const updateUserDto: UpdateUserDto = {
        password: 'test1234',
        nickname: 'test',
      };

      const spy = jest.spyOn(userService, 'update').mockResolvedValue({
        message: '수정이 완료되었습니다.',
      });

      userController.update(mockUser, updateUserDto);
      expect(spy).toHaveBeenCalledWith(mockUser, updateUserDto);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('remove', () => {
    it('remove 메소드를 실행하고 결과를 반환', () => {
      const mockRemoveUserDto: RemoveUserDto = {
        password: 'test1234',
      };

      const spy = jest.spyOn(userService, 'remove').mockResolvedValue({
        message: '계정이 성공적으로 삭제 되었습니다.',
      });

      userController.remove(mockUser, mockRemoveUserDto);

      expect(spy).toHaveBeenCalledWith(mockUser, mockRemoveUserDto);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});
