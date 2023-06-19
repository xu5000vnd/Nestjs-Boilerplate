import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { Prisma } from '@prisma/client'

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.user.findFirst({ where: { email } })
  }

  async create(user: Prisma.UserCreateInput) {
    return await this.prisma.user.create({ data: user })
  }
}
