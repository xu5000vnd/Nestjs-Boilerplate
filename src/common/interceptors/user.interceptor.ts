import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
  UnauthorizedException,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { JwtService } from '../../modules/jwt/jwt.service'

@Injectable()
export class UserInterceptor implements NestInterceptor {
  @Inject()
  private jwtService: JwtService
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest()
    const token = this.getToken(request)
    if (token) {
      const decodedToken = this.jwtService.verifyToken(token)
      if (!decodedToken) {
        throw new UnauthorizedException()
      }

      request.user = decodedToken.userId
    }

    return next.handle()
  }

  private getToken(request: Request): string | null {
    const headers: any = request.headers
    if (headers.authorization) {
      const token = headers.split(' ')[1]
      return token
    }
    return null
  }
}
