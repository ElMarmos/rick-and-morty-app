import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  // Enables the validation pipeline for request query params and body
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const options = new DocumentBuilder()
    .setTitle('Rick and Morty (Haufe) API')
    .setDescription('API documentation for the Rick and Morty (Haufe) API')
    .setVersion('1.0')
    .addSecurity('bearerAuth', {
      type: 'http',
      scheme: 'bearer',
    })
    .addTag('Users')
    .addTag('Authentication')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);

  const configService = app.get(ConfigService);

  await app.listen(configService.get('port'));
}

bootstrap();
