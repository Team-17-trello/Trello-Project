import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { v4 as uuidv4 } from 'uuid';
import { SignupDto } from '../dto/signup.dto';
import { Code } from 'typeorm';
import { SendEmailDto } from '../dto/sendEmail.dto';
// import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    // private readonly redisService: RedisService,
  ) {}

  async sendEmail(sendEmail: SendEmailDto) {
    const code = await this.createVerificationCode();
    await this.mailerService.sendMail({
      from: process.env.EMAIL_USER,
      to: sendEmail.email,
      subject: '이메일 인증 코드',
      text: `인증번호 : ${code}`,
    });

    // await this.redisService.set(sendEmail.email, code, 3600);
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
}
