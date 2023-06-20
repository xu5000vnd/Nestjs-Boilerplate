import { HttpStatus } from '@nestjs/common'
import { Exception } from './Exception'

export class UnauthorizedException extends Exception {
  constructor() {
    super('Unauthorized', HttpStatus.UNAUTHORIZED)
  }
}
