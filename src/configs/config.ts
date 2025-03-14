import * as dotenv from "dotenv";
dotenv.config();
import * as path from "path";

// Load .env file before accessing process.env variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

if (!process.env.PORT) {
  const parsedConfig = dotenv.config().parsed;
  if (parsedConfig?.MANUAL_ENV_ENABLED) {
    process.env = { ...process.env, ...parsedConfig };
    console.log('-- Manually parsed environment variables --');
  }
}

process.env.TZ = 'Asia/Kolkata';

export const CONFIG = {
  PORT: process.env.PORT || 3000,

  // Database Configuration
  DATABASE: {
    DB_HOST: process.env.DB_HOST || 'localhost',
    DB_USER: process.env.DB_USER || 'globetrotter_user',
    DB_PASSWORD: process.env.DB_PASSWORD || '',
    DB_NAME: process.env.DB_NAME || 'globetrotter',
    DB_PORT: Number(process.env.DB_PORT) || 5432,
  },

  // AI Service (For Generating Clues & Fun Facts)
  AI_SERVICE: {
    BASE_URL: process.env.AI_SERVICE_BASE_URL,
    API_KEY: process.env.AI_SERVICE_API_KEY,
  },

  // Multiplayer & Game Session Configs
  GAME: {
    MAX_PLAYERS: process.env.MAX_PLAYERS || 5,
    ROUND_TIME_LIMIT: process.env.ROUND_TIME_LIMIT || 60, // in seconds
  },

  // Authentication (Google OAuth or Custom Auth)
  AUTH: {
    JWT_SECRET: process.env.JWT_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI,
  },

  // Cloud Storage (For Storing Game Data, Images, etc.)
  CLOUD_STORAGE: {
    AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY,
    AWS_SECRET_KEY: process.env.AWS_SECRET_KEY,
    S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,
    S3_REGION: process.env.S3_REGION,
  },

  // WebSocket Configs (For Real-Time Multiplayer)
  WEBSOCKET: {
    WS_SERVER_URL: process.env.WS_SERVER_URL,
    WS_PORT: process.env.WS_PORT || 8080,
  },

  // Logging & Monitoring
  LOGGING: {
    LOG_LEVEL: process.env.LOG_LEVEL || 'info',
    SENTRY_DSN: process.env.SENTRY_DSN,
  },

  // External APIs (For Travel Data, Country Info, etc.)
  EXTERNAL_APIS: {
    TRAVEL_API_URL: process.env.TRAVEL_API_URL,
    TRAVEL_API_KEY: process.env.TRAVEL_API_KEY,
  },
};

// console.log('CONFIG:->', CONFIG);
