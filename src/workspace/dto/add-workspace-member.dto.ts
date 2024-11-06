import { IsNotEmpty, IsNumber } from 'class-validator';

export class AddWorkspaceMemberDto {
  @IsNumber({}, { message: 'userId는 숫자여야 합니다.' })
  @IsNotEmpty({ message: 'userId를 입력해주세요.' })
  userId: number;
}
