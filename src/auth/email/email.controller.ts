import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SendEmailDto } from '../dto/sendEmail.dto';
import { MailService } from './email.service';

@ApiTags('Auth')
@Controller('mail')
export class MailController {
  constructor(private readonly userService: MailService) {}

  @Post()
  @ApiOperation({ summary: '이메일 보내기' })
  async sendEmail(@Body() sendEmail: SendEmailDto) {
    return this.userService.sendEmail(sendEmail);
  }
}
