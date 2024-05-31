import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const config = app.get<ConfigService>(ConfigService);
  const port = config.get('SERVER_PORT');
  const corsOrigins = config.get<string>('CORS_ORIGINS').split(',');

  app.enableCors({
    credentials: true,
    origin: function (origin, callback) {
      if (corsOrigins.indexOf(origin) !== -1 || corsOrigins.includes('*')) {
        console.log('allowed cors for:', origin);
        callback(null, true);
      } else {
        console.log('blocked cors for:', origin);
        callback(new Error('Not allowed by CORS'));
      }
    },
  });
  await app.listen(port);
}
bootstrap();
