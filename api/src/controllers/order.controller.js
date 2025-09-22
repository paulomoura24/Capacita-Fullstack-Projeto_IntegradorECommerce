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

export async function getOne(req, res, next) {
  try {
    const id = Number(req.params.id)
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: 'Invalid order id' })
    }

    const userId = req.user.id
    const role = req.user.role
    const isAdmin = role === 'ADMIN'

    const order = await orderService.getOrderById({ id, userId, isAdmin })
    if (!order) return res.status(404).json({ error: 'Order not found' })
    return res.json(order)
  } catch (err) {
    next(err)
  }
}