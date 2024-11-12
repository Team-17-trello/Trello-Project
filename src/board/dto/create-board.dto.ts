import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBoardDto {
  @ApiProperty({ description: '워크스페이스 아이디', example: 1 })
  @IsInt()
  @IsNotEmpty({ message: '워크 스페이스 아이디를 작성해 주세요.' })
  workspaceId: number;

  @ApiProperty({ description: '보드 이름', example: '보드이름 입니다' })
  @IsString()
  @IsNotEmpty({ message: '보드 이름을 작성해 주세요.' })
  name: string;

  @ApiProperty({ description: '보드 설명', example: '보드에 대한 설명입니다.' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: '보드 배경색', example: '1' })
  @IsString()
  @IsOptional()
  backgroundColor?: string;
}
