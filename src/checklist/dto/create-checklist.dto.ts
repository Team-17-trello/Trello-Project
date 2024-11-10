import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateChecklistDto {
  @ApiProperty({ description: '카드 아이디', example: 1 })
  @IsNumber()
  @IsNotEmpty({ message: '카드아이디를 입력해주세요' })
  cardId: number;

  @ApiProperty({ description: '체크리스트 이름', example: '체크리스트 이름입니다.' })
  @IsString()
  @IsNotEmpty({ message: '체크리스트 이름을 입력해주세요' })
  checklistName: string;
}
