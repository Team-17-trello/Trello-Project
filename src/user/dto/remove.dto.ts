import { IsNotEmpty, IsString } from 'class-validator';

export class RemoveUserDto {
  @IsString()
  @IsNotEmpty({message: '비밀 번호를 입력해주세요.'})
  password?: string;
}