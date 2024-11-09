import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';
export class SendEmailDto {
  @ApiProperty({ description: '유저 이메일', example: 'example@example.com' })
  @IsString()
  @IsNotEmpty({ message: '이메일을 입력해주세요.' })
  email: string;
}
