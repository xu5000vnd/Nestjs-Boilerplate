import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { CreditService } from './credit.service'
import { JwtAuthGuard } from 'src/common/guards/auth.guard'
import { UserId } from 'src/common/decorators/user.decorator'

@Controller('credit')
export class CreditController {
  constructor(private readonly creditService: CreditService) {}

  @Post('/')
  @UseGuards(JwtAuthGuard)
  deposit(@UserId() userId: number, @Body() amount: number) {
    const message = this.creditService.deposit(userId, amount)
    return { message }
  }
}
