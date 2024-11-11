import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { CreateBoardDto } from './create-board.dto';

export class UpdateBoardDto extends PartialType(CreateBoardDto) {
  @ApiProperty({ description: '보드 이름', example: '수정된 보드이름 입니다.' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ description: '보드 설명', example: '수정된 보드에 대한 설명입니다.' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: '보드 배경색', example: '2' })
  @IsString()
  @IsOptional()
  backgroundColor?: string;
}
