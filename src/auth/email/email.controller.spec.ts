import { Test, TestingModule } from '@nestjs/testing';
import { MailController } from './email.controller';
import { MailService } from './email.service';
import { SendEmailDto } from '../dto/sendEmail.dto';

describe('노드 메일러 컨트롤러 테스트 코드', () => {
  let mailController: MailController;
  let mailService: MailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MailController],
      providers: [
        {
          provide: MailService,
          useValue: {
            sendEmail: jest.fn(),
          },
        },
      ],
    }).compile();

    mailController = module.get<MailController>(MailController);
    mailService = module.get<MailService>(MailService);
  });

  describe('sendEmail', () => {
    it('메일을 성공적으로 전송한다.', async () => {
      const sendEmailDto: SendEmailDto = {
        email: 'test@example.com',
      };
      (mailService.sendEmail as jest.Mock).mockResolvedValue({
        message: '이메일이 성공적으로 전송되었습니다.',
      });

      const result = await mailController.sendEmail(sendEmailDto);

      expect(result).toEqual({ message: '이메일이 성공적으로 전송되었습니다.' });
      expect(mailService.sendEmail).toHaveBeenCalledWith(sendEmailDto);
    });
  });
});
