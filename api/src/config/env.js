import dotenv from 'dotenv'
dotenv.config()

function resolvePort() {
  const raw = Number(process.env.PORT)
  if (Number.isFinite(raw) && raw > 0) return raw
  return 3000
}

export const config = {
  port: resolvePort(),
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET || 'change_me',
  uploadMaxSize: parseInt(process.env.UPLOAD_MAX_SIZE || '5242880', 10),
  uploadAllowedMime: (process.env.UPLOAD_ALLOWED_MIME || 'image/jpeg,image/png,image/webp').split(',')
}
