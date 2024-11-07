import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateItemDto {
  @IsString()
  @IsOptional()
  content?: string;

  @IsString()
  @IsBoolean()
  status?: boolean;
}
