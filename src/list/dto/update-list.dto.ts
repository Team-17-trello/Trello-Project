import { IS_ALPHA, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateListDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsNumber()
  @IsOptional()
  order?: number;

  @IsNumber()
  @IsOptional()
  listId?: number;
}
