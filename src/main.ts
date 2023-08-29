import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Logger, ValidationPipe } from '@nestjs/common';
import { SwaggerTheme, SwaggerThemeName } from 'swagger-themes';
import * as ip from 'ip';
import { EnvEnum, ConfigInterface } from '@app/core';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = app.get<ConfigService<ConfigInterface>>(ConfigService);

  const PORT = config.get('MAIN_SVC_PORT');
  const NODE_ENV = config.get('NODE_ENV');
  const SWAGGER_THEME = config.get<SwaggerThemeName>('SWAGGER_THEME');

  app.setGlobalPrefix('/api');

  if (NODE_ENV !== EnvEnum.PRODUCTION) {
    Logger.log('cors: *');
    app.enableCors();
  }
  const swaggerOptions = new DocumentBuilder()
    .setTitle('VK GID NEW API')
    .setDescription('API VK GID NEW')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerOptions);
  const swaggerTheme = new SwaggerTheme('v3');

  SwaggerModule.setup('docs', app, swaggerDocument, {
    explorer: true,
    customCss: swaggerTheme.getBuffer(SWAGGER_THEME),
  });
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(PORT);

  Logger.log(`URL: http://${ip.address()}:${PORT}/docs`, 'Documentation');

  return Logger.log(`Listening port: ${PORT}`, 'NestFactory');
}
bootstrap();
