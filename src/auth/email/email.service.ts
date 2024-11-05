// import { Injectable } from '@nestjs/common';
// import { MailerService } from '@nestjs-modules/mailer';
//
// @Injectable()
// export class ExampleService {
//   constructor(private readonly mailerService: MailerService) {}
//
//   public example(to : string): void {
//     this.mailerService
//       .sendMail({
//         to: to, // list of receivers
//         from: 'hee687299@gmail.com', // sender address
//         subject: 'Testing Nest MailerModule ✔', // Subject line
//         text: 'welcome', // plaintext body
//         html: '<b>welcome</b>', // HTML body content
//       })
//       .then(() => {})
//       .catch(() => {});
//   }
// }