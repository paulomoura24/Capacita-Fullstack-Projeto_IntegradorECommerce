import { orderCreateSchema } from '../validators/order.schemas.js';
import * as orderService from '../services/order.service.js';

export async function create(req, res) {
  const parsed = orderCreateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: { message: 'Dados inválidos', details: parsed.error.issues } });
  }
  const result = await orderService.createOrder({
    userId: req.user.sub,
    items: parsed.data.items,
    shippingAddress: parsed.data.shippingAddress,
    payment: parsed.data.payment
  });
  res.status(201).json(result);
}

export async function listMy(req, res) {
  const orders = await orderService.getMyOrders(req.user.sub);
  res.json({ orders });
}

export async function getOne(req, res) {
  const id = Number(req.params.id);
  const order = await orderService.getOrderById(req.user.sub, id);
  res.json({ order });
}
