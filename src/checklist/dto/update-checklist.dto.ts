import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { CreateChecklistDto } from './create-checklist.dto';

export class UpdateChecklistDto extends PartialType(CreateChecklistDto) {
  @ApiProperty({ description: '체크리스트 이름', example: '체크리스트 이름 입니다.' })
  @IsString()
  @IsNotEmpty({ message: '수정 하실 체크리스트 이름을 입력해주세요' })
  checklistName?: string;
}
