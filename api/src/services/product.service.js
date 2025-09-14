import { prisma } from '../prisma/client.js';

export async function createProduct(data, ownerId) {
  const { title, description, price, stock, imageBuffer, imageMime, imageName } = data;
  if (!imageBuffer || !imageMime) {
    const err = new Error('Imagem do produto é obrigatória');
    err.status = 400;
    throw err;
  }
  return prisma.product.create({
    data: {
      title, description,
      price, stock,
      image: imageBuffer,
      imageMime, imageName,
      ownerId
    },
    select: { id: true, title: true, price: true, stock: true, ownerId: true, createdAt: true }
  });
}

export async function updateProduct(id, data, requester) {
  const prod = await prisma.product.findUnique({ where: { id } });
  if (!prod) {
    const err = new Error('Produto não encontrado');
    err.status = 404;
    throw err;
  }
  if (requester.role !== 'ADMIN' && prod.ownerId !== requester.sub) {
    const err = new Error('Você não pode alterar este produto');
    err.status = 403;
    throw err;
  }
  const payload = { ...data };
  if (data.imageBuffer && data.imageMime) {
    payload.image = data.imageBuffer;
    payload.imageMime = data.imageMime;
    payload.imageName = data.imageName || prod.imageName;
  }
  return prisma.product.update({
    where: { id },
    data: payload,
    select: { id: true, title: true, price: true, stock: true, ownerId: true, updatedAt: true }
  });
}

export async function listProducts() {
  return prisma.product.findMany({
    where: { active: true },
    select: { id: true, title: true, price: true, stock: true, ownerId: true, createdAt: true }
  });
}

export async function getProduct(id) {
  return prisma.product.findUnique({
    where: { id },
    select: { id: true, title: true, description: true, price: true, stock: true, ownerId: true, createdAt: true }
  });
}

export async function getProductImage(id) {
  const prod = await prisma.product.findUnique({ where: { id } });
  if (!prod || !prod.image) {
    const err = new Error('Imagem não encontrada');
    err.status = 404;
    throw err;
  }
  return { buffer: prod.image, mime: prod.imageMime, name: prod.imageName };
}

export async function removeProduct(id, requester) {
  const prod = await prisma.product.findUnique({ where: { id } });
  if (!prod) {
    const err = new Error('Produto não encontrado');
    err.status = 404;
    throw err;
  }
  if (requester.role !== 'ADMIN' && prod.ownerId !== requester.sub) {
    const err = new Error('Você não pode remover este produto');
    err.status = 403;
    throw err;
  }
  await prisma.product.update({ where: { id }, data: { active: false } });
  return { ok: true };
}
