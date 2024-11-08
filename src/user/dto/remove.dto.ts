import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RemoveUserDto {
  @ApiProperty({ description: '비밀번호', example: 'password1234' })
  @IsString()
  @IsNotEmpty({ message: '비밀 번호를 입력해주세요.' })
  password?: string;
}
