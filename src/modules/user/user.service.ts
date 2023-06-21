import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { Prisma } from '@prisma/client'
import { UserProfile } from './dto/user.dto'

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.user.findFirst({ where: { email } })
  }

  async findById(id: number) {
    return this.prisma.user.findFirst({ where: { id } })
  }

  async update(id: number, data: Prisma.UserUpdateInput) {
    return this.prisma.user.update({ where: { id }, data })
  }

  async create(user: Prisma.UserCreateInput) {
    return await this.prisma.user.create({ data: user })
  }

  async getProfile(userId: number): Promise<UserProfile> {
    const user = await this.prisma.user.findFirst({ where: { id: userId } })
    delete user.password
    return user
  }
}
