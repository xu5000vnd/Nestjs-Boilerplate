import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './modules/auth/auth.module'
import { PrismaModule } from './modules/prisma/prisma.module'
import config from './configs/system.config'
import { UserModule } from './modules/user/user.module'
import { MailerModule } from './modules/mailer/mailer.module'
import { CreditModule } from './modules/credit/credit.module'
import { BidModule } from './modules/bid/bid.module'
import { BullModule } from '@nestjs/bull'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get('redis.host'),
          port: configService.get('redis.port'),
        },
      }),
    }),
    AuthModule,
    PrismaModule,
    UserModule,
    MailerModule,
    CreditModule,
    BidModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
