import express from 'express'
import cors from 'cors'
import 'express-async-errors'
import { errorHandler } from './middlewares/error.js'
import authRoutes from './routes/auth.routes.js'
import productRoutes from './routes/product.routes.js'
import orderRoutes from './routes/order.routes.js'
import userRoutes from './routes/user.routes.js'


import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)


const IS_SERVERLESS = !!process.env.VERCEL

const app = express()
app.use(cors())
app.use(express.json({ limit: '25mb' }))
app.use(express.urlencoded({ extended: true, limit: '25mb' }))

if (!IS_SERVERLESS) {
    const uploadsDir = path.join(__dirname, '..', 'uploads')
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true })
    app.use('/uploads', express.static(uploadsDir))
}

app.get('/favicon.ico', (_req, res) => res.status(204).end())
app.get('/favicon.png', (_req, res) => res.status(204).end())
app.get('/', (_req, res) => res.json({ ok: true }))

app.use('/auth', authRoutes)
app.use('/users', userRoutes)
app.use('/products', productRoutes)
app.use('/orders', orderRoutes)

app.use(errorHandler)
export default app
