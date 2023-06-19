import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ConfigService } from '@nestjs/config'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.enableCors()
  const config = app.get(ConfigService)

  await app.listen(config.get('APP_PORT', 3001))
}
void bootstrap()
