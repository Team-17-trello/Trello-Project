import { ApiProperty } from '@nestjs/swagger';
import { IS_ALPHA, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateListDto {
  @ApiProperty({ description: '리스트 이름', example: '수정된 리스트 이름 입니다.' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ description: '변경할 자리 숫자', example: 2 })
  @IsNumber()
  @IsOptional()
  order?: number;

  @ApiProperty({ description: '리스트 아이디', example: 1 })
  @IsNumber()
  @IsOptional()
  listId?: number;
}
