import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateItemDto {
  @ApiProperty({ description: '체크리스트 아이템 설명', example: 1 })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiProperty({ description: '체크리스트 아이템 상태 ', example: true })
  @IsString()
  @IsBoolean()
  status?: boolean;
}
