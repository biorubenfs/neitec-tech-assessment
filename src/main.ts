import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CONFIG } from './config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  await app.listen(CONFIG.PORT);
}
void bootstrap();
