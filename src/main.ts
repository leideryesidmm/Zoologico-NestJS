import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Elimina propiedades no incluidas en el DTO
      //forbidNonWhitelisted: true, // Lanza errores si se envían propiedades no permitidas
      //transform: true, // Realiza la transformación de tipos cuando sea necesario
    }),
  );
  await app.listen(3000);
}
bootstrap();
