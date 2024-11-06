import { IsString, IsEmail, IsNotEmpty, Length, IsNumber } from 'class-validator';

export class SignupDto{

  @IsEmail()
  @IsNotEmpty({ message: '이메일을 입력해주세요' })
  email: string;

  // @IsNumber()
  // @IsNotEmpty({ message: '메일로 발송된 인증 번호를 입력해주세요.' })
  // authNumber: number;

  @IsString()
  @Length(8, 16,{message:'비밀번호는 8자 이상이며 16글자 이하만 가능합니다.'})
  @IsNotEmpty({message: '비밀 번호를 입력해주세요.'})
  password : string;

  @IsString()
  @IsNotEmpty({message: '확인 비밀 번호를 입력해주세요.'})
  confirmedPassword : string;

  @IsString()
  @IsNotEmpty({message: '닉네임을 입력해주세요.'})
  nickname: string;


}
