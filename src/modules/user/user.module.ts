import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UsersController } from './user.controller'
import { ItemModule } from '../item/item.module'

@Module({
  imports: [ItemModule],
  controllers: [UsersController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
