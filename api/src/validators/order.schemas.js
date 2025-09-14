import { z } from 'zod';

export const orderCreateSchema = z.object({
  items: z.array(z.object({
    productId: z.number().int().positive(),
    quantity: z.number().int().positive()
  })).min(1),
  shippingAddress: z.string().min(5),
  payment: z.object({
    holderName: z.string().min(3),
    cardNumber: z.string().min(12),
    expMonth: z.number().int().min(1).max(12),
    expYear: z.number().int().min(new Date().getFullYear() - 1).max(new Date().getFullYear() + 15),
    cvv: z.string().min(3).max(4)
  })
});
