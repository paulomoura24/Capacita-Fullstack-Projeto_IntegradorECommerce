import { prisma } from '../prisma/client.js';
import { approveFakeCard } from './fake_payment.js';

export async function createOrder({ userId, items, shippingAddress, payment }) {
  const productIds = items.map(i => i.productId);
  const products = await prisma.product.findMany({ where: { id: { in: productIds }, active: true } });
  const byId = Object.fromEntries(products.map(p => [p.id, p]));
  let total = 0;
  for (const it of items) {
    const p = byId[it.productId];
    if (!p) {
      const err = new Error(`Produto ${it.productId} não disponível`);
      err.status = 400;
      throw err;
    }
    if (it.quantity > p.stock) {
      const err = new Error(`Estoque insuficiente para ${p.title}`);
      err.status = 400;
      throw err;
    }
    total += Number(p.price) * it.quantity;
  }

  const result = await prisma.$transaction(async (tx) => {
    const order = await tx.order.create({
      data: { userId, total, shippingAddress, status: 'CREATED' }
    });
    for (const it of items) {
      const p = byId[it.productId];
      await tx.orderItem.create({
        data: {
          orderId: order.id,
          productId: p.id,
          quantity: it.quantity,
          unitPrice: p.price
        }
      });
      await tx.product.update({
        where: { id: p.id },
        data: { stock: p.stock - it.quantity }
      });
    }

    const approved = approveFakeCard(total, payment.cardNumber);
    const status = approved ? 'APPROVED' : 'DECLINED';

    const paymentRec = await tx.payment.create({
      data: {
        orderId: order.id,
        status,
        amount: total,
        holderName: payment.holderName,
        cardLast4: payment.cardNumber.slice(-4)
      }
    });

    const finalOrder = await tx.order.update({
      where: { id: order.id },
      data: { status: approved ? 'PAID' : 'PAYMENT_FAILED' }
    });

    return { order: finalOrder, payment: paymentRec };
  });

  return result;
}

export async function getMyOrders(userId) {
  return prisma.order.findMany({
    where: { userId },
    include: { items: true, payment: true }
  });
}

export async function getOrderById(userId, id) {
  const order = await prisma.order.findFirst({
    where: { id, userId },
    include: { items: true, payment: true }
  });
  if (!order) {
    const err = new Error('Pedido não encontrado');
    err.status = 404;
    throw err;
  }
  return order;
}
