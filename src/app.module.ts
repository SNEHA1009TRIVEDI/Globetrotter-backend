import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CONFIG } from './configs/config';

@Module({
  imports: [
    // Load environment variables globally
    ConfigModule.forRoot({ isGlobal: true }),

    // Database Connection (PostgreSQL)
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: CONFIG.DATABASE.DB_HOST,
      port: Number(CONFIG.DATABASE.DB_PORT),
      username: CONFIG.DATABASE.DB_USER,
      password: CONFIG.DATABASE.DB_PASSWORD,
      database: CONFIG.DATABASE.DB_NAME,
      autoLoadEntities: true,
      synchronize: process.env.NODE_ENV !== 'production', // Disable in production
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
