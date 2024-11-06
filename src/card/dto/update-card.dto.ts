import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateCardDto {

  @IsString()
  title?: string;

  @IsString()
  description?: string;

  @IsString()
  color?: string;


}


