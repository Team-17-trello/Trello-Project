import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty } from 'class-validator';

export class AddWorkspaceMemberDto {
  @ApiProperty({ description: '유저 아이디', example: [1, 2, 3, 4] })
  @IsArray()
  @Type(() => Number)
  @IsNotEmpty({ message: 'userId를 입력해주세요.' })
  userId: number[];
}
