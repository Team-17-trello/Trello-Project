import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateItemDto {
  @IsNumber()
  @IsNotEmpty({ message: '리스트 아이디를 입력해주세요' })
  checklistId: number;

  @IsString()
  @IsOptional()
  content: string;
}
