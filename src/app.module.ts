import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './modules/auth/auth.module'
import { PrismaModule } from './modules/prisma/prisma.module'
import config from './configs/system.config'
import { UserModule } from './modules/user/user.module'
import { JwtModule } from './modules/jwt/jwt.module'
import { MailerModule } from './modules/mailer/mailer.module'
import { CreditModule } from './modules/credit/credit.module'
import { BidModule } from './modules/bid/bid.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    AuthModule,
    PrismaModule,
    UserModule,
    JwtModule,
    MailerModule,
    CreditModule,
    BidModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
