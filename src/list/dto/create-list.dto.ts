import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateListDto {
  @ApiProperty({ description: '보드 아이디', example: 1 })
  @IsInt()
  @IsNotEmpty({ message: '보드 아이디를 작성해 주세요.' })
  boardId: number;

  @ApiProperty({ description: '리스트 이름', example: '리스트 이름 입니다.' })
  @IsString()
  @IsNotEmpty({ message: '리스트 이름을 작성해 주세요.' })
  name: string;
}
