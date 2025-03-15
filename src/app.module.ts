import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CONFIG } from './configs/config';
import { Location } from './entities/location.entity';
import { DatabaseService } from './seeds/database.service';
import { LocationModule } from './locations/location.module';
import { AuthModule } from './auth/auth.module';

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
      ssl:
        process.env.NODE_ENV === 'production'
          ? { rejectUnauthorized: false }
          : false,
    }),
    LocationModule,
    AuthModule,
    TypeOrmModule.forFeature([Location]),
  ],
  controllers: [AppController],
  providers: [AppService, DatabaseService],
})
export class AppModule {}
