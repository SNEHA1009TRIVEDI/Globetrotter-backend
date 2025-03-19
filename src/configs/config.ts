import * as dotenv from 'dotenv';

// Load environment variables from .env file if not in production
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();

  if (!process.env.PORT) {
    const parsedConfig = dotenv.config().parsed;
    if (parsedConfig?.MANUAL_ENV_ENABLED) {
      process.env = { ...process.env, ...parsedConfig };
      console.log('-- Manually parsed environment variables --');
    }
  }
}

process.env.TZ = 'Asia/Kolkata';

export const CONFIG = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || '3080',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',

  // Database Configuration
  DATABASE: {
    DB_HOST: process.env.DB_HOST || 'localhost',
    DB_USER: process.env.DB_USER || 'postgres',
    DB_PASSWORD: process.env.DB_PASSWORD || 'postgres',
    DB_NAME: process.env.DB_NAME || 'globetrotter',
    DB_PORT: Number(process.env.DB_PORT || '5432'),
  },

  // AI Service (For Generating Clues & Fun Facts)
  AI_SERVICE: {
    API_KEY: process.env.AI_SERVICE_API_KEY || '',
  },
};
