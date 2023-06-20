import { HttpStatus } from '@nestjs/common'

export class Exception extends Error {
  private readonly statusCode: HttpStatus

  constructor(message: string, statusCode: HttpStatus) {
    super(message)
    this.statusCode = statusCode
  }
}
