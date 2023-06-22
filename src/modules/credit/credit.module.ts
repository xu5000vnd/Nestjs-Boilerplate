import { Module } from '@nestjs/common'
import { CreditService } from './credit.service'
import { CreditController } from './credit.controller'
import { UserModule } from '../user/user.module'

@Module({
  imports: [UserModule],
  controllers: [CreditController],
  providers: [CreditService],
})
export class CreditModule {}
