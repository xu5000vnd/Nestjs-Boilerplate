import {
  Controller,
  Get,
  Param,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common'
import { JwtAuthGuard } from '../../common/guards/auth.guard'
import { UserId } from 'src/common/decorators/user.decorator'
import { UserProfile } from './dto/user.dto'
import { UserService } from './user.service'
import { ApiHeaders, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Item } from '@prisma/client'

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly user: UserService) {}

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get User Profile' })
  @ApiHeaders([
    {
      name: 'Authorization',
      description: 'Bearer token',
    },
  ])
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 404, description: 'User not found' })
  getProfile(@UserId() userId: number): Promise<UserProfile> {
    return this.user.getProfile(userId)
  }

  @Get('/:id/items')
  @UseGuards(JwtAuthGuard)
  getMyItems(@UserId() userId: number, @Param() id: number): Promise<Item[]> {
    if (userId == id) {
      return this.user.getItems(userId)
    }
    throw new UnauthorizedException()
  }
}
