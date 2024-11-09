import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserInfo } from 'src/utils/userInfo-decolator';
import { SignupDto } from '../dto/signup.dto';
import { MailService } from './email.service';
import { SendEmailDto } from '../dto/sendEmail.dto';

@Controller('mail')
export class MailController {
  constructor(private readonly userService: MailService) {}

  @Post()
  @ApiTags('Auth')
  @ApiOperation({ summary: '이메일 보내기' })
  async sendEmail(@Body() sendEmail: SendEmailDto) {
    return this.userService.sendEmail(sendEmail);
  }
}
