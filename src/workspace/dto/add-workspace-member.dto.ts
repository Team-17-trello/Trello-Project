import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';

export class AddWorkspaceMemberDto {
  @IsArray()
  @Type(() => Number)
  @IsNotEmpty({ message: 'userId를 입력해주세요.' })
  userId: number[];
}
