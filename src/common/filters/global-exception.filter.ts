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
    console.log(
      '🚀 ~ file: global-exception.filter.ts:15 ~ GlobalExceptionsFilter ~ exception:',
      exception,
    )
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
      response.status(status).json({
        statusCode: status,
        message: 'Internal Server Error',
        timestamp: new Date().toISOString(),
        path: request.url,
      })
    }
  }
}
