import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Length,
} from 'class-validator'

export class ItemInputDto {
  @IsNotEmpty()
  @IsString()
  @Length(5)
  name: string

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  startPrice: number

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @IsInt()
  timeWindow: number
}
