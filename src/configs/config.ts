import * as dotenv from 'dotenv';
dotenv.config();

if (!process.env.PORT) {
  const parsedConfig = dotenv.config().parsed;
  if (parsedConfig?.MANUAL_ENV_ENABLED) {
    process.env = { ...process.env, ...parsedConfig };
    console.log('-- Manually parsed environment variables --');
  }
}
process.env.TZ = 'Asia/Kolkata';
export const CONFIG = {
  PORT: process.env.PORT,
  FRONTEND_URL: process.env.FRONTEND_URL,
  // Database Configuration
  DATABASE: {
    DB_HOST: process.env.DB_HOST,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_NAME: process.env.DB_NAME,
    DB_PORT: Number(process.env.DB_PORT),
  },

  // AI Service (For Generating Clues & Fun Facts)
  AI_SERVICE: {
    API_KEY: process.env.AI_SERVICE_API_KEY,
  },
};

