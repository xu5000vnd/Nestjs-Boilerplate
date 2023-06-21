import { BadRequestException, Injectable } from '@nestjs/common'
import { LoginDto } from './dto/login.dto'
import { User, Prisma, UserStatusEnum } from '@prisma/client'
import { JwtService } from '../jwt/jwt.service'
import { comparePassword, hashPassword } from 'src/utils/password.util'
import { SignUpDto } from './dto/signup.dto'
import { UserService } from '../user/user.service'
import { MailerService } from '../mailer/mailer.service'
import { EMAIL_TEMPLATE } from 'src/common/enums/mailer.enum'

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly mailer: MailerService,
  ) {}

  async login(loginDto: LoginDto): Promise<string> {
    const user = await this.validateUser(loginDto.email, loginDto.password)
    if (user) {
      const payload = { userId: user.id }
      const token = this.jwtService.generateToken(payload)
      return token
    }

    throw new BadRequestException('Invalid Credentials')
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
      throw new BadRequestException([
        {
          field: 'email',
          error: 'Email is already taken',
        },
      ])
    }

    const hashedPassword = await hashPassword(signupDto.password)
    const userToDb: Prisma.UserCreateInput = {
      email: signupDto.email,
      password: hashedPassword,
      status: UserStatusEnum.ACTIVE,
    }
    await this.userService.create(userToDb)

    await this.mailer.sendMail({
      to: signupDto.email,
      subject: 'Welcome to the app',
      template: EMAIL_TEMPLATE.SIGN_UP,
      variables: {
        email: signupDto.email,
      },
    })
    return 'User registered successfully.'
  }
}
