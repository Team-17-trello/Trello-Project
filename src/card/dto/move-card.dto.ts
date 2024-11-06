import { IsNotEmpty, IsNumber } from 'class-validator';

export class MoveCardDto {
  @IsNumber()
  @IsNotEmpty({ message: '이동할 리스트 아이디를 입력해주세요.' })
  listId: number;

  @IsNumber()
  @IsNotEmpty({ message: '이동할 카드 순서를 입력해주세요.' })
  order: number;
}
