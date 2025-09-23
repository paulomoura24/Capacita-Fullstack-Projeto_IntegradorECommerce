import { PrismaClient } from '@prisma/client';

const g = globalThis;
export const prisma = g.__prisma ?? new PrismaClient({
    datasources: { db: { url: process.env.DATABASE_URL } },
    log: ['error', 'warn'],
});
if (!g.__prisma) g.__prisma = prisma;

export default prisma;