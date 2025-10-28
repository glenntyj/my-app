import dotenv from 'dotenv';

dotenv.config();

const config = {
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET || 'your-dev-secret-key',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  dataPath: process.env.DATA_PATH || './data',
  env: process.env.NODE_ENV || 'development'
};

export default config;