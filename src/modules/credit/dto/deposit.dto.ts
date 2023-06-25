import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator'

export class DepositDto {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  amount: number
}
