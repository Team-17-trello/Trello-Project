import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateItemDto {
  @ApiProperty({ description: '체크 리스트 아이디', example: 1 })
  @IsNumber()
  @IsNotEmpty({ message: '체크 리스트 아이디를 입력해주세요' })
  checklistId: number;

  @ApiProperty({ description: '아이템 설명', example: '체크리스트 아이템입니다.' })
  @IsString()
  @IsOptional()
  content: string;
}
