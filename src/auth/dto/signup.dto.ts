import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsNotEmpty, Length, IsNumber } from 'class-validator';

export class SignupDto {
  @ApiProperty({ description: '유저 이메일', example: 'example@example.com' })
  @IsEmail()
  @IsNotEmpty({ message: '이메일을 입력해주세요' })
  email: string;

  // @IsNumber()
  // @IsNotEmpty({ message: '메일로 발송된 인증 번호를 입력해주세요.' })
  // authNumber: number;

  @ApiProperty({ description: '유저 비밀번호', example: 'password123' })
  @IsString()
  @Length(8, 16, { message: '비밀번호는 8자 이상이며 16글자 이하만 가능합니다.' })
  @IsNotEmpty({ message: '비밀 번호를 입력해주세요.' })
  password: string;

  @ApiProperty({ description: '유저 비밀번호확인', example: 'password123' })
  @IsString()
  @IsNotEmpty({ message: '확인 비밀 번호를 입력해주세요.' })
  confirmedPassword: string;

  @ApiProperty({ description: '유저 닉네임', example: '스웨거짱' })
  @IsString()
  @IsNotEmpty({ message: '닉네임을 입력해주세요.' })
  nickname: string;
}
