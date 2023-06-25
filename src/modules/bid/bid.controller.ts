import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common'
import { BidService } from './bid.service'
import { UserId } from 'src/common/decorators/user.decorator'
import { BidItemDto } from './dto/bid.dto'
import { JwtAuthGuard } from 'src/common/guards/auth.guard'
import { Item } from '@prisma/client'
import { ItemService } from '../item/item.service'

@Controller('bids')
export class BidController {
  constructor(
    private readonly bidService: BidService,
    private readonly itemService: ItemService,
  ) {}

  @Post('/items/:itemId')
  @UseGuards(JwtAuthGuard)
  async bidItem(
    @UserId() userId: number,
    @Param('itemId') itemId: number,
    @Body() body: BidItemDto,
  ): Promise<{ message: string }> {
    const message = await this.bidService.bidItem(userId, itemId, body.amount)
    return { message }
  }

  @Get('/items')
  @UseGuards(JwtAuthGuard)
  getListItems(): Promise<Item[]> {
    return this.itemService.getListItems()
  }
}
