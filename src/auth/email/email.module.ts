import * as path from 'path';
import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailController } from './email.controller';
import { MailService } from './email.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          service: 'gmail',
          host: 'smtp.gmail.com',
          port: 587,
          auth: {
            user: process.env.EMAILADDRESS,
            pass: process.env.EMAILPASSWORD,
          },
        },
        defaults: {
          from: `'인증번호' <${process.env.EMAILADDRESS}>`,
        },
      }),
    }),
  ],
  controllers: [MailController],
  providers: [MailService],
})
export class MailModule {}
