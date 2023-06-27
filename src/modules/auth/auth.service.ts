import { BadRequestException, Injectable } from '@nestjs/common'
import { LoginDto } from './dto/login.dto'
import { User, Prisma, UserStatusEnum } from '@prisma/client'
import { comparePassword, hashPassword } from 'src/utils/password.util'
import { SignUpDto } from './dto/signup.dto'
import { UserService } from '../user/user.service'
import { MailerService } from '../mailer/mailer.service'
import { EMAIL_TEMPLATE } from 'src/common/enums/mailer.enum'
import JwtUtil from 'src/utils/jwt.util'

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly mailer: MailerService,
  ) {}

  async login(loginDto: LoginDto): Promise<any> {
    const user = await this.validateUser(loginDto.email, loginDto.password)
    if (user) {
      const payload = { userId: user.id }
      const token = JwtUtil.createTokenJwt(payload)
      delete user.password
      return {
        accessToken: token,
        ...user,
      }
    }

    throw new BadRequestException('Invalid Credentials')
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userService.findByEmail(email)
    if (user.status !== UserStatusEnum.ACTIVE) {
      throw new BadRequestException(
        'Your account is inactive. Please contact to Admin to active your account',
      )
    }

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
