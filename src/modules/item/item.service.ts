import { BadRequestException, Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { Item, ItemStatusEnum, Prisma } from '@prisma/client'
import * as moment from 'moment'
import { InjectQueue } from '@nestjs/bull'
import { Queue } from 'bull'

@Injectable()
export class ItemService {
  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue('item') private readonly itemQueue: Queue,
  ) {}

  async getItemsByUserId(userId: number): Promise<Item[]> {
    return this.prisma.item.findMany({ where: { userId } })
  }

  async findById(id: number): Promise<Item> {
    return this.prisma.item.findFirst({
      where: { id },
    })
  }

  async findBidItemSuccess(id: number): Promise<any> {
    return this.prisma.item.findFirst({
      where: {
        id,
      },
      include: {
        bids: {
          orderBy: { createdAt: 'desc' },
        },
      },
    })
  }

  async addItem(data): Promise<Item> {
    return this.prisma.item.create({ data })
  }

  async endItem(id: number): Promise<Item> {
    return this.prisma.item.update({
      where: { id },
      data: { status: ItemStatusEnum.EXPIRED },
    })
  }

  async publishItem(userId: number, id: number): Promise<string> {
    const item = await this.findById(id)
    if (item) {
      if (item.userId == userId) {
        if (item.status == ItemStatusEnum.PENDING) {
          item.status = ItemStatusEnum.ACTIVE
          item.publishedAt = moment().toDate()
          item.endedAt = moment().add(item.timeWindow, 'seconds').toDate()
          await this.prisma.item.update({
            where: { id },
            data: item,
          })
          // add queue
          await this.itemQueue.add(
            'enditem',
            {
              itemId: id,
            },
            {
              delay: item.timeWindow * 1000, //ms
            },
          )

          return 'Item published successfully'
        } else {
          throw new BadRequestException('Item already published')
        }
      } else {
        throw new BadRequestException('Unauthorized')
      }
    } else {
      throw new BadRequestException('Not found Item')
    }
  }

  async getListItems(): Promise<Item[]> {
    const where: Prisma.ItemWhereInput = {
      status: ItemStatusEnum.ACTIVE,
      endedAt: {
        gte: moment().toDate(),
      },
    }
    return await this.prisma.item.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        bids: {
          orderBy: { createdAt: 'desc' },
        },
      },
    })
  }

  async getListCompletedItems(): Promise<Item[]> {
    const where: Prisma.ItemWhereInput = {
      status: ItemStatusEnum.EXPIRED,
    }
    return await this.prisma.item.findMany({
      where,
      orderBy: { endedAt: 'desc' },
      include: {
        bids: {
          orderBy: { createdAt: 'desc' },
        },
      },
    })
  }
}
