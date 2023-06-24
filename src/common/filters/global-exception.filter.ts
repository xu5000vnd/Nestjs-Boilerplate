import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common'
import { Request, Response } from 'express'

@Catch()
export class GlobalExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    Logger.debug(exception)
    const ctx = host.switchToHttp()
    const request = ctx.getRequest<Request>()
    const response = ctx.getResponse<Response>()
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR
    if (exception instanceof HttpException) {
      const dataResponse = exception.getResponse()
      response.status(HttpStatus.OK).json(dataResponse)
    } else {
      console.log(22222)
      response.status(status).json({
        statusCode: status,
        message: 'Internal Server Error',
        timestamp: new Date().toISOString(),
        path: request.url,
      })
    }
  }
}
