import { Module } from '@nestjs/common'
import { CreditService } from './credit.service'
import { CreditController } from './credit.controller'
import { UserModule } from '../user/user.module'
import { TransactionModule } from '../transaction/transaction.module'

@Module({
  imports: [UserModule, TransactionModule],
  controllers: [CreditController],
  providers: [CreditService],
})
export class CreditModule {}
