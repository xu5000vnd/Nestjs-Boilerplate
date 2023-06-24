import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { AuthService } from './auth.service'
import { LoginDto } from './dto/login.dto'
import { SignUpDto } from './dto/signup.dto'
import {
  ApiBody,
  ApiHeaders,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiHeaders([
    {
      name: 'Content-Type',
      description: 'x-www-form-urlencoded',
    },
  ])
  @ApiOperation({ summary: 'User Login' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          format: 'email',
          example: 'user@example.com',
        },
        password: {
          type: 'string',
          format: 'password',
          example: 'Password@123',
        },
      },
      required: ['email', 'password'],
    },
  })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto): Promise<{ accessToken: string }> {
    const data = await this.authService.login(loginDto)
    return data
  }

  @Post('signup')
  @ApiOperation({ summary: 'User Signup' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          format: 'email',
          example: 'user@example.com',
        },
        password: {
          type: 'string',
          format: 'password',
          example: 'Password@123',
        },
      },
      required: ['email', 'password'],
    },
  })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() signupDto: SignUpDto): Promise<{ message: string }> {
    const message = await this.authService.signup(signupDto)
    return { message }
  }
}
