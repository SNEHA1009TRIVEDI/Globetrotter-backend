import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for React frontend
  app.enableCors({
    origin: 'http://localhost:5173', // Allow requests from your React app
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true, // Allow cookies and auth headers
  });

  // 🔹 Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('Globetrotter API')
    .setDescription('API documentation for the Globetrotter Game')
    .setVersion('1.0')
    .addBearerAuth() // Add JWT authentication support
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document); // API docs at /api-docs

  await app.listen(process.env.PORT ?? 3080);
}

bootstrap();
