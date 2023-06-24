import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common'
import { UnauthorizedException } from '../exceptions/Unauthorization.exception'

@Catch(UnauthorizedException)
export class UnauthExceptionFilter implements ExceptionFilter {
  catch(exception: UnauthorizedException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse()

    response.status(401).json({
      statusCode: 401,
      message: exception.message,
    })
  }
}
