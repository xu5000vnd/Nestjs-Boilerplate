import { Test } from '@nestjs/testing'
import { AuthService } from './auth.service'
import { UserService } from '../user/user.service'
import { MailerService } from '../mailer/mailer.service'
import { BadRequestException } from '@nestjs/common'
import { SignUpDto } from './dto/signup.dto'
import { EMAIL_TEMPLATE } from 'src/common/enums/mailer.enum'
import { User, UserStatusEnum } from '@prisma/client'
import JwtUtil from 'src/utils/jwt.util'
import * as PasswordUtil from 'src/utils/password.util'
import { LoginDto } from './dto/login.dto'
import { PrismaService } from '../prisma/prisma.service'
import { ItemService } from '../item/item.service'
import { ConfigService } from '@nestjs/config'

const userMock: User = {
  id: 1,
  email: 'user@example.com',
  password: 'hashedPassword',
  status: UserStatusEnum.ACTIVE,
  balance: 10,
  createdAt: new Date(),
  updatedAt: new Date(),
}

const loginDto: LoginDto = {
  email: 'user@example.com',
  password: 'Password@123',
}

const signupDto: SignUpDto = {
  email: 'user@example.com',
  password: 'Password@123',
}

describe('AuthService', () => {
  let authService: AuthService
  let userService: UserService
  let mailerService: MailerService

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        UserService,
        MailerService,
        PrismaService,
        ItemService,
        { provide: ConfigService, useValue: {} },
        { provide: JwtUtil, useValue: { createTokenJwt: jest.fn() } },
      ],
    }).compile()

    authService = moduleRef.get<AuthService>(AuthService)
    userService = moduleRef.get<UserService>(UserService)
    mailerService = moduleRef.get<MailerService>(MailerService)
  })

  describe('signup', () => {
    it('should create a new user and send an email when signup is successful', async () => {
      // const hashedPassword = await PasswordUtil.hashPassword(signupDto.password)
      const expectedUser = Object.assign({}, userMock, {
        status: UserStatusEnum.ACTIVE,
      })
      jest.spyOn(userService, 'findByEmail').mockResolvedValueOnce(null)
      jest.spyOn(userService, 'create').mockResolvedValueOnce(expectedUser)
      // jest.spyOn(mailerService, 'sendMail').mockResolvedValueOnce()

      const result = await authService.signup(signupDto)

      expect(result).toEqual('User registered successfully.')
      expect(userService.findByEmail).toHaveBeenCalledWith(signupDto.email)
      expect(userService.create).toHaveBeenCalledWith(expectedUser)
      // expect(mailerService.sendMail).toHaveBeenCalledWith({
      //   to: signupDto.email,
      //   subject: 'Welcome to the app',
      //   template: EMAIL_TEMPLATE.SIGN_UP,
      //   variables: {
      //     email: signupDto.email,
      //   },
      // })
    })

    it('should throw a BadRequestException if email is already taken', async () => {
      jest
        .spyOn(userService, 'findByEmail')
        .mockResolvedValueOnce(
          Object.assign(userMock, { email: 'abc@gmail.com' }),
        )

      await expect(authService.signup(signupDto)).rejects.toThrow(
        BadRequestException,
      )
      expect(userService.findByEmail).toHaveBeenCalledWith(signupDto.email)
    })
  })

  // describe('login', () => {
  //   it('should return an access token when login is successful', async () => {
  //     const email = loginDto.email
  //     const password = loginDto.password
  //     const user = {
  //       id: 1,
  //       email,
  //       password: await PasswordUtil.hashPassword(password),
  //       status: UserStatusEnum.ACTIVE,
  //       balance: 0,
  //       createdAt: new Date(),
  //       updatedAt: new Date(),
  //     }
  //     const token = 'access-token'
  //     jest.spyOn(userService, 'findByEmail').mockResolvedValueOnce(user)
  //     // jest.spyOn(authService, 'validateUser').mockResolvedValueOnce(user)
  //     jest.spyOn(JwtUtil, 'createTokenJwt').mockReturnValueOnce(token)

  //     const result = await authService.login({ email, password })

  //     expect(result).toEqual({
  //       accessToken: token,
  //       id: user.id,
  //       email: user.email,
  //       status: user.status,
  //     })
  //     expect(userService.findByEmail).toHaveBeenCalledWith(email)
  //     // expect(authService.validateUser).toHaveBeenCalledWith(email, password)
  //     expect(JwtUtil.createTokenJwt).toHaveBeenCalledWith({ userId: user.id })
  //   })

  //   it('should throw a BadRequestException if user is inactive', async () => {
  //     const email = loginDto.email
  //     const password = loginDto.password
  //     const user = Object.assign({}, userMock, {
  //       status: UserStatusEnum.INACTIVE,
  //     })
  //     jest.spyOn(userService, 'findByEmail').mockResolvedValueOnce(user)

  //     await expect(authService.login({ email, password })).rejects.toThrow(
  //       BadRequestException,
  //     )
  //     expect(userService.findByEmail).toHaveBeenCalledWith(email)
  //   })

  //   it('should throw a BadRequestException if user is not found', async () => {
  //     jest.spyOn(userService, 'findByEmail').mockResolvedValueOnce(null)

  //     await expect(
  //       authService.login({
  //         email: loginDto.email,
  //         password: loginDto.password,
  //       }),
  //     ).rejects.toThrow(BadRequestException)
  //     expect(userService.findByEmail).toHaveBeenCalledWith(loginDto.email)
  //   })
  // })
})
