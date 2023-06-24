import { Body, Controller, Param, Post } from '@nestjs/common'
import { BidService } from './bid.service'
import { UserId } from 'src/common/decorators/user.decorator'
import { BidItemDto } from './dto/bid.dto'

@Controller('bids')
export class BidController {
  constructor(private readonly bidService: BidService) {}

  @Post('/item/:itemId')
  bidItem(
    @UserId() userId: number,
    @Param() itemId: number,
    @Body() body: BidItemDto,
  ) {
    return this.bidService.bidItem(userId, itemId, body.amount)
  }
}
