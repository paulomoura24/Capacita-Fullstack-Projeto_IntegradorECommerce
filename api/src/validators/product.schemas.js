import { z } from 'zod';

export const createProductSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  price: z.number().positive(),
  stock: z.number().int().nonnegative()
});

export const updateProductSchema = createProductSchema.partial();
