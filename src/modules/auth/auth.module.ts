import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { JwtModule } from '../jwt/jwt.module'
import { UserModule } from '../user/user.module'
import { MailerModule } from '../mailer/mailer.module'

@Module({
  imports: [JwtModule, UserModule, MailerModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
