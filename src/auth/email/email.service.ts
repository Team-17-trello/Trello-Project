import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { v4 as uuidv4 } from 'uuid';
import { SignupDto } from '../dto/signup.dto';
import { Code } from 'typeorm';
import { SendEmailDto } from '../dto/sendEmail.dto';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
  ) {}

  //  1. 클라이언트가 인증번호 요청시 인증번호 발송
  //        ㄴ레디스에 저장
  //  2. 클라이언트가 회원가입 요청시 이메일로 발송했던 인증번와 레이스에 저장해둔 인증번호 비교
  //  3. 비교한 인증번호 일치하면 회원가입 성공

  async sendEmail(sendEmail: SendEmailDto) {
    const code = await this.createVerificationCode();
    await this.mailerService.sendMail({
      from: process.env.EMAIL_USER,
      to: sendEmail.email,
      subject: '이메일 인증 코드',
      text: `인증코드 = ${code}`,
    });
    // await this.redis.save()-
  }

  
  private async redisa() {
    const redis = {}

    
    
  }

  private createVerificationCode() {
    const code = uuidv4().slice(0, 6);
    console.log(code);
    return code;
  }
}
