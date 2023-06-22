import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator'

export class BidItemDto {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  amount: number
}
