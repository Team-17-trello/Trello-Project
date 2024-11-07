import { IsArray,  IsNotEmpty } from 'class-validator';

export class ResponsibleDto {

  @IsArray()
  @IsNotEmpty({ message: '카드 담당자(들)를 입력해주세요.'})
  responsibles : number[]

}