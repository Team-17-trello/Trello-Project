import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCardDto {
  @ApiProperty({ description: '리스트 아이디', example: 1 })
  @IsNumber()
  @IsNotEmpty({ message: '리스트 아이디를 입력해주세요' })
  listId: number;

  @ApiProperty({ description: '카드 제목', example: 'subject' })
  @IsString()
  @IsNotEmpty({ message: '카드 제목을 입력해주세요' })
  title: string;

  @ApiProperty({ description: '카드 설명', example: 'description' })
  @IsString()
  @IsNotEmpty({ message: '카드 설명을 입력해주세요' })
  description: string;

  @ApiProperty({ description: '카드 색상', example: 'black' })
  @IsString()
  @IsNotEmpty({ message: '색상을 입력해주세요' })
  color: string;

  @ApiProperty({ description: '마감일', example: '2024-11-24 00:00:00' })
  @IsDateString()
  @IsOptional()
  dueDate?: Date;
}
