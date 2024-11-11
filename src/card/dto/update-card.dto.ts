import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateCardDto {
  @ApiProperty({ description: '카드 제목', example: 'title' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ description: '카드 설명', example: 'description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: '카드 색상', example: 'black' })
  @IsString()
  @IsOptional()
  color?: string;
}
