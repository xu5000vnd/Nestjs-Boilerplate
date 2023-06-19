import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { AuthService } from './auth.service'
import { LoginDto } from './dto/login.dto'
import { SignUpDto } from './dto/signup.dto'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto): Promise<{ accessToken: string }> {
    const accessToken = await this.authService.login(loginDto)
    return { accessToken }
  }

  @Post('signup')
  @HttpCode(HttpStatus.OK)
  async signup(@Body() signupDto: SignUpDto): Promise<{ message: string }> {
    const message = await this.authService.signup(signupDto)
    return { message }
  }
}
