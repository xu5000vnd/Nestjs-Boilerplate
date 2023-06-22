import { BadGatewayException, Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { Item, ItemStatusEnum, Prisma } from '@prisma/client'
import moment from 'moment'

@Injectable()
export class ItemService {
  constructor(private readonly prisma: PrismaService) {}

  async getItemsByUserId(userId: number): Promise<Item[]> {
    return this.prisma.item.findMany({ where: { userId } })
  }

  async findById(id: number): Promise<Item> {
    return this.prisma.item.findFirst({ where: { id } })
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

  async publishItem(userId: number, id: number): Promise<Item> {
    const item = await this.findById(id)
    if (item) {
      if (item.userId == userId) {
        if (!item.publishedAt) {
          item.status = ItemStatusEnum.ACTIVE
          item.publishedAt = moment().toDate()
          item.endedAt = moment().add(item.timeWindow, 'seconds').toDate()
          return this.prisma.item.update({ where: { id }, data: item })
        } else {
          throw new BadGatewayException('Item already published')
        }
      } else {
        throw new BadGatewayException('Unauthorized')
      }
    } else {
      throw new BadGatewayException('Not found Item')
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
