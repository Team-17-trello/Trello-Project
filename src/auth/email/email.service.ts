import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { v4 as uuidv4 } from 'uuid';
import { SignupDto } from '../dto/signup.dto';
import { Code } from 'typeorm';
import { SendEmailDto } from '../dto/sendEmail.dto';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly redisService: RedisService,
  ) {}

  async sendEmail(sendEmail: SendEmailDto) {
    const code = await this.createVerificationCode();
    await this.mailerService.sendMail({
      from: process.env.EMAIL_USER,
      to: sendEmail.email,
      subject: '이메일 인증 코드',
      text: `인증번호 : ${code}`,
    });

    await this.redisService.set(sendEmail.email, code, 3600);
  }

  //레디스에서 인증번호 저장 메서드 만들어주면 그거 사용
  //회원가입 로직에 if(레디스인증번호 !== body.인증번호){ '인증번호가 일치하지 않습니다' } <- 추가

  private createVerificationCode() {
    const code = uuidv4().slice(0, 6);
    return code;
  }
}
