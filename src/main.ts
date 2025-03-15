import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CONFIG } from './configs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS using config
  app.enableCors({
    origin: CONFIG.FRONTEND_URL, // Use from config or default
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true, // Allow cookies and auth headers
  });

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('Globetrotter API')
    .setDescription('API documentation for the Globetrotter Game')
    .setVersion('1.0')
    .addBearerAuth() // Add JWT authentication support
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document); // API docs at /api-docs

  await app.listen(CONFIG.PORT ?? 3080);
}

bootstrap();
