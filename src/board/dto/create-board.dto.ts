import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBoardDto {
  @IsInt()
  @IsNotEmpty({ message: '워크 스페이스 아이디를 작성해 주세요.' })
  workspaceId: number;

  @IsString()
  @IsNotEmpty({ message: '보드 이름을 작성해 주세요.' })
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  backgroundColor?: string;
}
