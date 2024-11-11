import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateWorkspaceDto {
  @ApiProperty({ description: '워크 스페이스 이름', example: '워크 스페이스 이름 입니다.' })
  @IsString()
  @IsNotEmpty({ message: 'workspaceName을 입력해주세요.' })
  workspaceName: string;
}
