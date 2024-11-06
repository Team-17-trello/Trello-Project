import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateListDto {
  @IsInt()
  @IsNotEmpty({ message: '보드 아이디를 작성해 주세요.' })
  boardId: number;

  @IsString()
  @IsNotEmpty({ message: '리스트 이름을 작성해 주세요.' })
  name: string;
}
