import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateChecklistDto {
  @IsNumber()
  @IsNotEmpty({ message: '카드아이디를 입력해주세요' })
  cardId: number;

  @IsString()
  @IsNotEmpty({ message: '체크리스트 이름을 입력해주세요' })
  checklistName: string;
}
