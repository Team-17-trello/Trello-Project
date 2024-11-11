import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateListDto {
  @ApiProperty({ description: '리스트 이름', example: '수정된 리스트 이름 입니다.' })
  @IsString()
  @IsOptional()
  name?: string;
}
