import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateItemDto {
  @ApiProperty({ description: '체크리스트 아이템 설명', example: '체크리스트 아이템 설명' })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiProperty({ description: '체크리스트 아이템 상태 ', example: true })
  @IsBoolean()
  @IsOptional()
  status?: boolean;
}
