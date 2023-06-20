import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common'
import { JwtService } from '../../modules/jwt/jwt.service'
import { AuthGuard } from '@nestjs/passport'
import { UnauthorizedException } from '../exceptions/Unauthorization.exception'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(@Inject(JwtService) private readonly jwtService: JwtService) {
    super()
  }

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest()
    const token = this.extractTokenFromRequest(request)
    if (!token) {
      throw new UnauthorizedException()
    }

    const decodedToken = this.jwtService.verifyToken(token)
    if (!decodedToken) {
      throw new UnauthorizedException()
    }

    return super.canActivate(context)
  }

  private extractTokenFromRequest(request: Request): string | null {
    const headers: any = request.headers
    if (headers.authorization) {
      const token = headers.split(' ')[1]
      return token
    }
    return null
  }
}
