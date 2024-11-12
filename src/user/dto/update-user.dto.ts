import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ description: '비밀번호', example: 'password1234' })
  @IsString()
  @IsOptional()
  password?: string;

  @ApiProperty({ description: '닉네임', example: '최강민재' })
  @IsString()
  @IsOptional()
  nickname?: string;
}
