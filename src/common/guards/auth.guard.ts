import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { UnauthorizedException } from '../exceptions/Unauthorization.exception'
import JwtUtil from 'src/utils/jwt.util'

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest()
    const token = this.extractTokenFromRequest(request)
    if (!token) {
      throw new UnauthorizedException()
    }
    const decodedToken = JwtUtil.decodeTokenJwt(token)
    if (!decodedToken) {
      throw new UnauthorizedException()
    }

    return true
  }

  private extractTokenFromRequest(request: Request): string | null {
    const headers: any = request.headers
    const authorization = headers.authorization
    if (authorization) {
      const token = authorization.split(' ')[1]
      return token
    }
    return null
  }
}
