import { RedisService } from '@liaoliaots/nestjs-redis';
import { MailerService } from '@nestjs-modules/mailer';
import { Test, TestingModule } from '@nestjs/testing';
import { SendEmailDto } from '../dto/sendEmail.dto';
import { MailService } from './email.service';

describe('MailService', () => {
  let mailService: MailService;
  let mailerServiceMock: Partial<MailerService>;
  let redisServiceMock: Partial<RedisService>;

  beforeEach(async () => {
    mailerServiceMock = {
      sendMail: jest.fn().mockResolvedValue(undefined),
    };

    redisServiceMock = {
      getOrThrow: jest.fn().mockReturnValue({
        set: jest.fn().mockResolvedValue('OK'),
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailService,
        {
          provide: MailerService,
          useValue: mailerServiceMock,
        },
        {
          provide: RedisService,
          useValue: redisServiceMock,
        },
      ],
    }).compile();

    mailService = module.get<MailService>(MailService);
  });

  it('should be defined', () => {
    expect(mailService).toBeDefined();
  });

  describe('sendEmail', () => {
    it('이메일 발송 후 Redis에 인증번호를 저장해야함', async () => {
      const sendEmailDto: SendEmailDto = { email: 'test@example.com' };

      const result = await mailService.sendEmail(sendEmailDto);

      expect(mailerServiceMock.sendMail).toHaveBeenCalledWith({
        from: process.env.EMAIL_USER,
        to: sendEmailDto.email,
        subject: '이메일 인증 코드',
        text: expect.stringContaining('인증번호 :'),
      });

      expect(redisServiceMock.getOrThrow().set).toHaveBeenCalledWith(
        sendEmailDto.email,
        expect.any(String),
        'EX',
        3600,
      );

      expect(result).toEqual({
        message: `${sendEmailDto.email}로 인증번호가 전송되었습니다.`,
      });
    });
  });

  describe('sendMemberEmail', () => {
    it('user에게 멤버로 초대 되었다는 이메일을 발송해야함', async () => {
      const email = 'member@example.com';

      await mailService.sendMemberEmail(email);

      expect(mailerServiceMock.sendMail).toHaveBeenCalledWith({
        from: process.env.EMAIL_USER,
        to: email,
        subject: '멤버를 초대합니다.',
        html: expect.stringContaining('Verify email'),
      });
    });
  });
});
