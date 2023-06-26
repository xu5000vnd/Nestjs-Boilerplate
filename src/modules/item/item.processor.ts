import { Process, Processor } from '@nestjs/bull'
import { Inject, Logger, forwardRef } from '@nestjs/common'
import { Job } from 'bull'
import { ItemService } from './item.service'
import { UserService } from '../user/user.service'
import { EMAIL_TEMPLATE } from 'src/common/enums/mailer.enum'
import { MailerService } from '../mailer/mailer.service'
import { BidStatusEnum } from '@prisma/client'

@Processor('item')
export class ItemProcessor {
  constructor(
    private readonly itemSerivce: ItemService,
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    private readonly mailer: MailerService,
  ) {}
  private readonly logger = new Logger(ItemProcessor.name)

  @Process('enditem')
  async handleTranscode(job: Job) {
    this.logger.debug('Start transcoding...')
    this.logger.debug(job.data)
    const item = await this.itemSerivce.findBidItemSuccess(job.data.itemId)
    if (item) {
      await this.itemSerivce.endItem(job.data.id)
      const bids = item?.bids
      if (bids?.length) {
        const bid = bids[0]
        if (bid.status === BidStatusEnum.SUCCESS) {
          const user = await this.userService.findById(bid.userId)
          if (user) {
            await this.mailer.sendMail({
              to: user.email,
              subject: 'Won the bid',
              template: EMAIL_TEMPLATE.BID_SUCCESS,
              variables: {
                email: user.email,
              },
            })
          }
        }
      }
    }

    this.logger.debug('Transcoding completed')
  }
}
