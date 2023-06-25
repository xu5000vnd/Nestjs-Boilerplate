import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common'
import { ItemService } from './item.service'
import { JwtAuthGuard } from 'src/common/guards/auth.guard'
import { Item } from '@prisma/client'
import { ItemInputDto } from './dto/item.dto'
import { UserId } from 'src/common/decorators/user.decorator'

@Controller('items')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Get('/')
  @UseGuards(JwtAuthGuard)
  getListItems(): Promise<Item[]> {
    return this.itemService.getListItems()
  }

  @Get('/completion')
  @UseGuards(JwtAuthGuard)
  getListCompletedItems(): Promise<Item[]> {
    return this.itemService.getListCompletedItems()
  }

  @Post('/')
  @UseGuards(JwtAuthGuard)
  addItem(@Body() body: ItemInputDto, @UserId() userId: number): Promise<Item> {
    const data = { ...body, userId }
    return this.itemService.addItem(data)
  }

  @Post('/:id/publish')
  @UseGuards(JwtAuthGuard)
  async publishItem(
    @Param('id') id: number,
    @UserId() userId: number,
  ): Promise<{ message: string }> {
    const message = await this.itemService.publishItem(userId, id)
    return { message }
  }
}
