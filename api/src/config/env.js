import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET || 'change_me',
  uploadMaxSize: parseInt(process.env.UPLOAD_MAX_SIZE || '5242880', 10),
  uploadAllowedMime: (process.env.UPLOAD_ALLOWED_MIME || 'image/jpeg,image/png,image/webp').split(',')
};
