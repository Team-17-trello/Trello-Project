import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCardDto {
  @ApiProperty({ description: '리스트 아이디', example: 1 })
  @IsNumber()
  @IsNotEmpty({ message: '리스트 아이디를 입력해주세요' })
  listId: number;

  @IsString()
  @IsNotEmpty({ message: '카드 제목을 입력해주세요' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: '카드 설명을 입력해주세요' })
  description: string;

  @IsString()
  @IsNotEmpty({ message: '색상을 입력해주세요' })
  color: string;

  @IsDateString()
  @IsOptional()
  dueDate?: Date;
}
