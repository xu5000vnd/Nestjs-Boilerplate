import { sign, verify, JwtPayload } from 'jsonwebtoken'
import { UnauthorizedException } from 'src/common/exceptions/Unauthorization.exception'
require('dotenv').config()

class JwtUtil {
  static readonly key: Buffer = Buffer.from(process.env.JWT_ACCESS_SECRET)

  static decodeTokenJwt(token: string): string | JwtPayload {
    try {
      return verify(token, this.key)
    } catch (err) {
      throw new UnauthorizedException()
    }
  }

  static createTokenJwt(payload: any): string {
    return sign(payload, this.key, {
      expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    })
  }
}

export default JwtUtil
