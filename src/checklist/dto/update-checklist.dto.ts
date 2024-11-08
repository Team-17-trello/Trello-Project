import { PartialType } from '@nestjs/mapped-types';
import { CreateChecklistDto } from './create-checklist.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateChecklistDto extends PartialType(CreateChecklistDto) {
  @IsString()
  @IsNotEmpty({ message: '수정 하실 체크리스트 이름을 입력해주세요' })
  checklistName?: string;
}
