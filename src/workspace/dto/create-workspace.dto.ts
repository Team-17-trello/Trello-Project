import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateWorkspaceDto {
  @IsString()
  @IsNotEmpty({ message: 'workspaceName을 입력해주세요.' })
  workspaceName: string;
}
