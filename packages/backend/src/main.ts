import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const apiPrefix = configService.get('API_PREFIX', 'api');

  app.setGlobalPrefix(apiPrefix);
  app.enableCors({ origin: configService.get('CORS_ORIGIN', '*') });
  app.use(helmet.default());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = configService.get('PORT', 4000);
  await app.listen(port);
  console.log(`🚀 CMS Sekolah API running on http://localhost:${port}/${apiPrefix}`);
}

bootstrap();
