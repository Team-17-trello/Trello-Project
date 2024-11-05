import { IsNotEmpty, IsNumber } from 'class-validator';

export class InviteMemberDto {
  @IsNumber()
  @IsNotEmpty({ message: 'userId를 입력해주세요.' })
  userId: number[];
}
