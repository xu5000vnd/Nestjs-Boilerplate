import { Module } from '@nestjs/common'
import { JwtModule as NestJwtModule } from '@nestjs/jwt'
import { JwtService } from './jwt.service'
import { ConfigModule, ConfigService } from '@nestjs/config'

@Module({
  imports: [
    NestJwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT.JWT_SECRECT_KEY'),
        signOptions: {
          expiresIn: configService.get('JWT.JWT_EXPIRES_IN'),
        },
      }),
    }),
  ],
  providers: [JwtService],
  exports: [JwtService],
})
export class JwtModule {}
