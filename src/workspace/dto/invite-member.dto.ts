import { IsNotEmpty, IsNumber } from 'class-validator';

export class addWorkspaceMemberDto {
  @IsNumber()
  @IsNotEmpty({ message: 'userId를 입력해주세요.' })
  userId: number[];
}
