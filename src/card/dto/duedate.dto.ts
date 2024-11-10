import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty } from 'class-validator';

export class DueDateDto {
  @ApiProperty({ description: '마감 기한', example: '2024-11-24 00:00:00' })
  @IsDateString()
  @IsNotEmpty({ message: '마감 기한을 입력해주세요.' })
  dueDate: Date;
}
