import express from 'express'
import cors from 'cors'
import 'express-async-errors'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

import { errorHandler } from './middlewares/error.js'
import authRoutes from './routes/auth.routes.js'
import productRoutes from './routes/product.routes.js'
import orderRoutes from './routes/order.routes.js'
import userRoutes from './routes/user.routes.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const UPLOADS_DIR = path.resolve(__dirname, '..', 'uploads')
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true })

const app = express()


app.use(cors())
app.options('*', cors())

app.use(express.json({ limit: '25mb' }))
app.use(express.urlencoded({ extended: true, limit: '25mb' }))
app.use('/uploads', express.static(UPLOADS_DIR))

app.get('/health', (req, res) => res.json({ ok: true }))

app.use('/auth', authRoutes)
app.use('/users', userRoutes)
app.use('/products', productRoutes)
app.use('/orders', orderRoutes)

app.use(errorHandler)

export default app
