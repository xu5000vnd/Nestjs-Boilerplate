import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  UnauthorizedException,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import JwtUtil from 'src/utils/jwt.util'

@Injectable()
export class UserInterceptor implements NestInterceptor {
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest()
    const token = this.getToken(request)
    if (token) {
      const decodedToken = JwtUtil.decodeTokenJwt(token)
      if (!decodedToken) {
        throw new UnauthorizedException()
      }
      request.user = decodedToken['userId']
    }

    return next.handle()
  }

  private getToken(request: Request): string | null {
    const headers: any = request.headers
    const authorization = headers.authorization
    if (authorization) {
      const token = authorization.split(' ')[1]
      return token
    }
    return null
  }
}
