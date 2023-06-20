import { ConfigService } from '@nestjs/config'
import { NestExpressApplication } from '@nestjs/platform-express'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

export const setupSwagger = (app: NestExpressApplication) => {
  const configService = app.get<ConfigService>(ConfigService)
  const path = configService.get('swagger.path')

  const config = new DocumentBuilder().setTitle('API').setVersion('1.0').build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup(path, app, document)
}
