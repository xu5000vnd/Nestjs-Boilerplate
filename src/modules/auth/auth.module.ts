import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { JwtModule } from '../jwt/jwt.module'
import { UserModule } from '../user/user.module'

@Module({
  imports: [JwtModule, UserModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
