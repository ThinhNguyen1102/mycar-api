import {NestFactory} from '@nestjs/core'
import {AppModule} from './app.module'
import * as dotenv from 'dotenv'
import {appConfig} from './common/config/app.config'
import {ValidationPipe} from '@nestjs/common'
import {ErrorsInterceptor, exceptionFactory} from './common/errors/errors'
import {HttpExceptionFilter} from './common/errors/exceptions'
import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger'
import configuration from './common/config/configuration'
dotenv.config()

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.setGlobalPrefix(`${appConfig.prefix}/${appConfig.version}`)

  // Set up validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      stopAtFirstError: false,
      exceptionFactory: errors => exceptionFactory(errors),
    }),
  )

  // Set up Exception handler
  app.useGlobalFilters(new HttpExceptionFilter())

  // Set up Error handler
  app.useGlobalInterceptors(new ErrorsInterceptor())

  // Set up Swagger
  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Mycar API Documentation')
    .setDescription('UGC API Documentation')
    .setVersion(appConfig.version)
    .addTag('Mycar')
    .addServer(`${appConfig.domain}`)
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api/docs', app, document)

  await app.listen(configuration().app.port)
}
bootstrap()
