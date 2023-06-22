import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common'
import { Request, Response } from 'express'

@Catch()
export class GlobalExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const request = ctx.getRequest<Request>()
    const response = ctx.getResponse<Response>()
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR
    if (exception instanceof HttpException) {
      const dataResponse = exception.getResponse()
      response.status(status).json(dataResponse)
    } else {
      response.status(status).json({
        statusCode: status,
        message:
          exception instanceof HttpException
            ? exception.getResponse()
            : 'Internal Server Error',
        timestamp: new Date().toISOString(),
        path: request.url,
      })
    }
  }
}
