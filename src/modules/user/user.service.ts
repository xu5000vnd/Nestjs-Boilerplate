import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { Item, Prisma } from '@prisma/client'
import { UserProfile } from './dto/user.dto'
import { ItemService } from '../item/item.service'

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly itemService: ItemService,
  ) {}

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

  async getBalance(userId: number) {
    const user = await this.findById(userId)
    return user.balance
  }

  async getProfile(userId: number): Promise<UserProfile> {
    const user = await this.prisma.user.findFirst({ where: { id: userId } })
    delete user.password
    return user
  }

  async getItems(userId: number): Promise<Item[]> {
    const items = await this.itemService.getItemsByUserId(userId)
    return items
  }
}
