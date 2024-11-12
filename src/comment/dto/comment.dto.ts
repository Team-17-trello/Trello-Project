import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CommentDto {
  @ApiProperty({ description: '댓글', example: '안녕하세요' })
  @IsString()
  @IsNotEmpty({ message: '댓글 내용을 입력해주세요.' })
  text: string;
}
