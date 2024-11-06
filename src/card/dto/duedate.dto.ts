import { IsDateString,IsNotEmpty } from 'class-validator';

export class DueDateDto {

  @IsDateString()
  @IsNotEmpty({ message: '마감 기한을 입력해주세요.' })
  dueDate: Date;

}