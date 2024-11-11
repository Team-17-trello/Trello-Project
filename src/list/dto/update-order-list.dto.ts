import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdateOrderListDto {
  @ApiProperty({ description: '변경할 자리 숫자', example: 2 })
  @IsNumber()
  @IsOptional()
  order?: number;

  @ApiProperty({ description: '리스트 아이디', example: 1 })
  @IsNumber()
  @IsOptional()
  listId?: number;
}
