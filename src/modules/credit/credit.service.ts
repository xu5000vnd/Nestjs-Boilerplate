import { BadGatewayException, Injectable } from '@nestjs/common'
import { TransactionService } from '../transaction/transaction.service'
import { UserService } from '../user/user.service'
import { PrismaService } from '../prisma/prisma.service'
import { TransactionEnum } from '@prisma/client'

@Injectable()
export class CreditService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}
  async deposit(
    userId: number,
    amount: number,
    bidId?: number,
  ): Promise<string> {
    const user = await this.userService.findById(userId)
    if (!user) {
      throw new BadGatewayException('User not found')
    }

    await this.prisma.$transaction(async (prisma) => {
      const credit = user.balance + amount
      await prisma.user.update({
        where: { id: userId },
        data: { balance: credit },
      })

      const dataToTX = {
        userId: userId,
        amount: amount,
        state: TransactionEnum.DEPOSIT,
      }
      const tx = await prisma.transaction.create({
        data: dataToTX,
      })

      if (bidId) {
        await prisma.bidTransaction.create({
          data: {
            bidId: bidId,
            transactionId: tx.id,
          },
        })
      }
    })

    return 'Deposit was successful'
  }

  async withdraw(
    userId: number,
    amount: number,
    bidId?: number,
  ): Promise<string> {
    const user = await this.userService.findById(userId)
    if (!user) {
      throw new BadGatewayException('User not found')
    }

    await this.prisma.$transaction(async (prisma) => {
      const credit = user.balance - amount
      if (credit < 0) {
        throw new Error('You cannot withdraw more than your balance')
      }

      await prisma.user.update({
        where: { id: userId },
        data: { balance: credit },
      })

      const dataToTX = {
        userId: userId,
        amount: amount,
        state: TransactionEnum.WITHDRAW,
      }
      const tx = await prisma.transaction.create({
        data: dataToTX,
      })

      if (bidId) {
        await prisma.bidTransaction.create({
          data: {
            bidId: bidId,
            transactionId: tx.id,
          },
        })
      }
    })

    return 'Deposit was successful'
  }
}
