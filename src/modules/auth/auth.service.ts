import { Injectable, UnauthorizedException } from '@nestjs/common'
import { LoginDto } from './dto/login.dto'
import { PrismaService } from '../prisma/prisma.service'
import { User, Prisma, UserStatusEnum } from '@prisma/client'
import { JwtService } from '../jwt/jwt.service'
import { comparePassword, hashPassword } from 'src/utils/password.util'
import { SignUpDto } from './dto/signup.dto'
import { UserService } from '../user/user.service'

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  async login(loginDto: LoginDto): Promise<string> {
    const user = await this.validateUser(loginDto.email, loginDto.password)
    if (user) {
      const payload = { userId: user.id }
      const token = this.jwtService.generateToken(payload)
      return token
    }

    throw new UnauthorizedException('Invalid credentials')
  }

  private async validateUser(
    email: string,
    password: string,
  ): Promise<User | null> {
    const user = await this.userService.findByEmail(email)

    if (user) {
      const hashedPassword = user.password
      const isValid = await comparePassword(password, hashedPassword)
      if (isValid) {
        return user
      }
    }

    return null
  }

  async signup(signupDto: SignUpDto): Promise<string> {
    const user = await this.userService.findByEmail(signupDto.email)
    if (user) {
      throw new Error('Email is already taken')
    }

    const hashedPassword = await hashPassword(signupDto.password)
    const userToDb: Prisma.UserCreateInput = {
      email: signupDto.email,
      password: hashedPassword,
      status: UserStatusEnum.ACTIVE,
    }
    await this.userService.create(userToDb)
    return 'User registered successfully.'
  }
}
