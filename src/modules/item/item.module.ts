import { Module, forwardRef } from '@nestjs/common'
import { ItemService } from './item.service'
import { ItemController } from './item.controller'
import { BullModule } from '@nestjs/bull'
import { ItemProcessor } from './item.processor'
import { UserModule } from '../user/user.module'
import { MailerModule } from '../mailer/mailer.module'

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'item',
    }),
    forwardRef(() => UserModule),
    MailerModule,
  ],
  controllers: [ItemController],
  providers: [ItemService, ItemProcessor],
  exports: [ItemService],
})
export class ItemModule {}
