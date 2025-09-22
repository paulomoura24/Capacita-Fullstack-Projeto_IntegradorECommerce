import { prisma } from '../prisma/client.js';
import { approveFakeCard } from './fake_payment.js';

export async function createOrder({ userId, items, shippingAddress, payment }) {
  if (!Array.isArray(items) || items.length === 0) {
    const err = new Error('Informe pelo menos 1 item no pedido');
    err.status = 400;
    throw err;
  }
  const normalized = items.map(i => ({
    productId: Number(i.productId),
    quantity: Number(i.quantity),
  }));
  for (const it of normalized) {
    if (!Number.isInteger(it.productId) || it.productId <= 0) {
      const err = new Error(`productId inválido: ${it.productId}`);
      err.status = 400;
      throw err;
    }
    if (!Number.isInteger(it.quantity) || it.quantity <= 0) {
      const err = new Error(`quantity inválido para productId ${it.productId}`);
      err.status = 400;
      throw err;
    }
  }

  const productIds = normalized.map(i => i.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, active: true },
    select: { id: true, title: true, price: true, stock: true }
  });
  const byId = new Map(products.map(p => [p.id, p]));

  const missing = [];
  const insufficient = [];
  let total = 0;
  const lines = [];

  for (const it of normalized) {
    const p = byId.get(it.productId);
    if (!p) {
      missing.push({ productId: it.productId });
      continue;
    }
    if (it.quantity > p.stock) {
      insufficient.push({
        productId: p.id,
        productName: p.title,
        requested: it.quantity,
        available: p.stock
      });
      continue;
    }
    const unit = Number(p.price);
    const lineTotal = unit * it.quantity;
    total += lineTotal;
    lines.push({
      productId: p.id,
      productName: p.title,
      quantity: it.quantity,
      unitPrice: unit,
      lineTotal
    });
  }

  if (missing.length || insufficient.length) {
    const err = new Error('Falha de validação de itens do pedido');
    err.status = 400;
    err.details = { missing, insufficient };
    throw err;
  }

  const result = await prisma.$transaction(async (tx) => {
    const order = await tx.order.create({
      data: { userId, total, shippingAddress, status: 'CREATED' }
    });

    for (const line of lines) {
      await tx.orderItem.create({
        data: {
          orderId: order.id,
          productId: line.productId,
          quantity: line.quantity,
          unitPrice: line.unitPrice
        }
      });

      // reduz estoque
      const current = await tx.product.findUnique({
        where: { id: line.productId },
        select: { stock: true, title: true }
      });
      if (!current || current.stock < line.quantity) {
        const e = new Error(`Estoque insuficiente para ${line.productName}`);
        e.status = 409;
        throw e;
      }
      await tx.product.update({
        where: { id: line.productId },
        data: { stock: current.stock - line.quantity }
      });
    }

    const approved = approveFakeCard(total, payment.cardNumber);
    const paymentStatus = approved ? 'APPROVED' : 'DECLINED';

    const paymentRec = await tx.payment.create({
      data: {
        orderId: order.id,
        status: paymentStatus,
        amount: total,
        holderName: payment.holderName,
        cardLast4: String(payment.cardNumber).slice(-4)
      }
    });

    const finalOrder = await tx.order.update({
      where: { id: order.id },
      data: { status: approved ? 'PAID' : 'PAYMENT_FAILED' },
      include: {
        items: {
          include: {
            product: { select: { title: true } }
          }
        },
        payment: true
      }
    });

    return {
      order: finalOrder,
      payment: paymentRec,
      summary: {
        items: lines,
        total
      }
    };
  });

  return result;
}

export async function getMyOrders(userId) {
  return prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: {
      items: {
        include: {
          product: { select: { title: true } }
        }
      },
      payment: true
    }
  });
}

export async function getOrderById({ id, userId, isAdmin }) {
  if (!id || !Number.isInteger(id)) {
    throw new Error('Order id is required (integer)')
  }

  const where = isAdmin ? { id } : { id, userId }

  return prisma.order.findFirst({
    where,
    include: {
      items: {
        include: {
          product: {
            select: { title: true }
          }
        }
      },
      payment: true
    }
  })
}
