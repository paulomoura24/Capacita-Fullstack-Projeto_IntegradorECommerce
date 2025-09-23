import dotenv from 'dotenv'
dotenv.config()

function resolvePort() {
  const raw = Number(process.env.PORT)
  return Number.isFinite(raw) && raw > 0 ? raw : 3000
}

function resolveUploadMax() {
  const raw = Number(process.env.UPLOAD_MAX_SIZE)
  return Number.isFinite(raw) && raw > 0 ? raw : 5 * 1024 * 1024
}

export const config = {
  port: resolvePort(),
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET || 'change_me',
  uploadMaxSize: resolveUploadMax(),
  uploadAllowedMime: (process.env.UPLOAD_ALLOWED_MIME || 'image/jpeg,image/png,image/webp').split(',')
}
