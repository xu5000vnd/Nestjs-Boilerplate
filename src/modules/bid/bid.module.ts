import { Module } from '@nestjs/common'
import { BidService } from './bid.service'
import { BidController } from './bid.controller'
import { ItemModule } from '../item/item.module'
import { CreditModule } from '../credit/credit.module'
import { UserModule } from '../user/user.module'

@Module({
  imports: [ItemModule, CreditModule, UserModule],
  controllers: [BidController],
  providers: [BidService],
})
export class BidModule {}
