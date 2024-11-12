import { RedisService } from '@liaoliaots/nestjs-redis';
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { SendEmailDto } from '../dto/sendEmail.dto';

@Injectable()
export class MailService {
  private readonly redisClient;
  constructor(
    private readonly mailerService: MailerService,
    private readonly redisService: RedisService,
  ) {
    this.redisClient = this.redisService.getOrThrow();
  }

  async sendEmail(sendEmail: SendEmailDto) {
    const code = await this.createVerificationCode();
    await this.mailerService.sendMail({
      from: process.env.EMAIL_USER,
      to: sendEmail.email,
      subject: '이메일 인증 코드',
      text: `인증번호 : ${code}`,
    });

    await this.set(sendEmail.email, code, 3600);
    return { message: `${sendEmail.email}로 인증번호가 전송되었습니다.` };
  }

  async sendMemberEmail(email: string) {
    await this.mailerService.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: '멤버를 초대합니다.',
      html: `<p>Please click the following link to your email address:</p>
             <p> <a href="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQoM3eKwT27-FeFY_teH1iBqwreeOqs3MhgOQ&s">Verify email</a></p>`,
    });
  }

  private createVerificationCode() {
    const code = uuidv4().slice(0, 6);
    return code;
  }

  private async set(key: string, value: string, expiration: number): Promise<void> {
    if (!this.redisClient) {
      throw new Error('Redis client is not connected');
    }
    await this.redisClient.set(key, value, 'EX', expiration);
  }
}
