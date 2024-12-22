import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: [process.env.CLIENT_URL],
    credentials: true,
  });
  app.use((req, res, next) => {
    console.log('Origin:', req.headers.origin);
    next();
  });
  await app.listen(5000);
}
bootstrap();
