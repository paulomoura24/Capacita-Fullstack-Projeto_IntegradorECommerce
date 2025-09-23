import express from 'express';
import cors from 'cors';
import 'express-async-errors';
import { errorHandler } from './middlewares/error.js';
import authRoutes from './routes/auth.routes.js';
import productRoutes from './routes/product.routes.js';
import orderRoutes from './routes/order.routes.js';
import userRoutes from './routes/user.routes.js';

import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import prisma from './lib/prisma.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

if (process.env.NODE_ENV !== 'production') {
    const up = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(up)) fs.mkdirSync(up, { recursive: true });
    app.use('/uploads', express.static(up));
}


app.get('/', (req, res) => {
    res.json({ ok: true, service: 'API', env: process.env.NODE_ENV || 'unknown' });
});


app.get('/__debug/prisma', async (req, res) => {
    try {
        const u = await prisma.user.findFirst({ select: { id: true, role: true, email: true } });
        res.json({ ok: true, db: 'connected', sampleUser: u ?? null });
    } catch (e) {
        res.status(500).json({ ok: false, error: String(e?.message || e) });
    }
});

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

app.use(errorHandler);
export default app;
