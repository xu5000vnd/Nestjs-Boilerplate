import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ConfigService } from '@nestjs/config'
import { setupSwagger } from './integrations/swagger'
import { BadRequestException, ValidationPipe } from '@nestjs/common'
import { ValidationError } from 'class-validator'
import { NestExpressApplication } from '@nestjs/platform-express'
import { UserInterceptor } from './common/interceptors/user.interceptor'
import { GlobalExceptionsFilter } from './common/filters/global-exception.filter'
import { UnauthExceptionFilter } from './common/filters/unath-exception.filter'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  app.enableCors()
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        return new BadRequestException(
          validationErrors.map((error) => {
            return {
              field: error.property,
              error: Object.values(error.constraints)[0],
            }
          }),
        )
      },
    }),
  )

  app.useGlobalInterceptors(new UserInterceptor())
  app.useGlobalFilters(new GlobalExceptionsFilter())
  app.useGlobalFilters(new UnauthExceptionFilter())

  await setupSwagger(app)
  const config = app.get(ConfigService)
  await app.listen(config.get('APP_PORT', 3001), () => {
    console.log(
      `⚡️[server]: Server is running at http://localhost:${config.get(
        'APP_PORT',
        3001,
      )}`,
    )
  })
}
void bootstrap()
