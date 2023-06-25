import { BadRequestException, Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { UserService } from '../user/user.service'
import { ItemService } from '../item/item.service'
import { Bid, BidStatusEnum, TransactionEnum } from '@prisma/client'
import * as moment from 'moment'
import { SYSTEM_STATUS } from 'src/common/constants/system.constant'

@Injectable()
export class BidService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly itemService: ItemService,
  ) {}

  async bidItem(userId: number, itemId: number, amount: number) {
    const balance = await this.userService.getBalance(userId)
    if (balance < amount) {
      throw new BadRequestException('Not enough balance')
    }

    const item = await this.itemService.findById(itemId)
    if (item) {
      const currentTime = moment().unix()
      const endTime = moment(item.endedAt).unix()
      if (currentTime <= endTime) {
        const prevBid = await this.prevBidItem(itemId)
        if ((!prevBid && amount > item.startPrice) || prevBid.amount < amount) {
          await this.prisma.$transaction(async (prismaTx) => {
            // check balancer
            const user = await prismaTx.user.findFirst({
              where: { id: userId },
            })

            if (user.balance < amount) {
              throw new BadRequestException('Not enough balance')
            }

            await this.handleNewBid(prismaTx, { userId, itemId, amount })
            await this.handlePrevBid(prismaTx, { userId, itemId, amount })
          })
          return { message: 'Your bid is accepted', status: SYSTEM_STATUS.OK }
        } else {
          throw new BadRequestException(
            'Amount should be more than start price or previous bid',
          )
        }
      } else {
        await this.itemService.endItem(itemId)
        throw new BadRequestException('Item already ended')
      }
    } else {
      throw new BadRequestException('Not found Item')
    }
  }

  async prevBidItem(itemId: number): Promise<Bid> {
    return this.prisma.bid.findFirst({
      where: {
        itemId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  }

  async handleNewBid(prismaTx, params): Promise<void> {
    const { userId, itemId, amount } = params
    // create bid
    const bid = await prismaTx.bid.create({
      data: {
        userId,
        itemId,
        amount,
        status: BidStatusEnum.SUCCESS,
      },
    })

    // create transaction
    const tx = await prismaTx.transaction.create({
      data: {
        userId,
        amount,
        state: TransactionEnum.WITHDRAW,
      },
    })

    // create bid transaction
    await prismaTx.bidTransaction.create({
      data: {
        bidId: bid.id,
        transactionId: tx.id,
      },
    })
  }

  async handlePrevBid(prismaTx, params): Promise<void> {
    const { userId, itemId, amount } = params
    const prevBid = await this.prevBidItem(itemId)
    // refund previous bidder
    const prevUser = await prismaTx.user.findFirst({
      where: { id: userId },
    })
    // update balance
    await prismaTx.user.update({
      where: {
        id: prevUser.id,
      },
      data: {
        balance: prevUser.balance + prevBid.amount,
      },
    })
    // create transaction refund
    const prevTx = await prismaTx.transaction.create({
      data: {
        userId,
        amount,
        state: TransactionEnum.DEPOSIT,
      },
    })
    // update prev bid
    await prismaTx.bid.update({
      where: {
        id: prevBid.id,
      },
      data: {
        status: BidStatusEnum.FAILED,
        isRefund: true,
        refundedAt: moment().toDate(),
      },
    })

    // create bid transaction
    await prismaTx.bidTransaction.create({
      data: {
        bidId: prevBid.id,
        transactionId: prevTx.id,
      },
    })
  }
}
