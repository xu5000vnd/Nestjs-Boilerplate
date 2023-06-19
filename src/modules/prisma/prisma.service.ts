import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common'
import { Prisma, PrismaClient } from '@prisma/client'
import { PrismaClientInitializationError } from '@prisma/client/runtime'

import { LogLevel, PRISMA_CLIENT_OPTIONS } from '../../configs/prisma.config'

@Injectable()
export class PrismaService
  extends PrismaClient<Prisma.PrismaClientOptions, LogLevel>
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name)

  constructor() {
    super({ ...PRISMA_CLIENT_OPTIONS })
  }

  async onModuleInit() {
    await this.$connect().catch((error: PrismaClientInitializationError) => {
      this.logger.error(
        `🆘 Prisma failed to connect - Error code: ${error.errorCode} - Client version: ${error.clientVersion}`,
      )
      throw error
    })
    this.logger.log(`🚀 Prisma connected `)

    this.$on('query', (e) => {
      // console.log('>>> query', e)
    })

    this.$on('info', (e) => {
      this.logger.log(e)
    })

    this.$on('warn', (e) => {
      this.logger.warn(e)
    })

    this.$on('error', (e) => {
      this.logger.error(e)
    })
  }

  async onModuleDestroy() {
    await this.$disconnect()
    this.logger.log('🚧 Prisma disconnected!')
  }
}
