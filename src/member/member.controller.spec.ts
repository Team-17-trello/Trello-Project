import { Test, TestingModule } from '@nestjs/testing';
import { UserEntity } from '../user/entities/user.entity';
import { MemberController } from './member.controller';
import { MemberService } from './member.service';

describe('MemberController', () => {
  let memberController: MemberController;
  let memberService: MemberService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MemberController],
      providers: [
        {
          provide: MemberService,
          useValue: {
            switch: jest.fn(),
          },
        },
      ],
    }).compile();

    memberController = module.get<MemberController>(MemberController);
    memberService = module.get<MemberService>(MemberService);
  });

  const user: UserEntity = {
    id: 1,
    email: 'test@test.com',
    password: 'test1234',
    nickname: 'tester',
    createdAt: new Date(),
    deletedAt: null,
    members: null,
  };

  const workspaceId = '1';

  describe('switch', () => {
    it('switch 메소드를 실행하고 결과를 반환', () => {
      const spy = jest.spyOn(memberService, 'switch').mockResolvedValue({
        message: '권한을 변경하였습니다.',
      });

      memberController.switch(user, workspaceId, user.id + '');
      expect(spy).toHaveBeenCalledWith(user, +workspaceId, user.id);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});
