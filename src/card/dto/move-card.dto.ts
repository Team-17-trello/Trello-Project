import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class MoveCardDto {
  @ApiProperty({ description: '리스트 아이디', example: 1 })
  @IsNumber()
  @IsNotEmpty({ message: '이동할 리스트 아이디를 입력해주세요.' })
  listId: number;

  @ApiProperty({ description: '카드 순서', example: 1 })
  @IsNumber()
  @IsNotEmpty({ message: '이동할 카드 순서를 입력해주세요.' })
  order: number;
}
