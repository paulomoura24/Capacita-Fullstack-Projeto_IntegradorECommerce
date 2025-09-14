import { createProductSchema, updateProductSchema } from '../validators/product.schemas.js';
import * as productService from '../services/product.service.js';

export async function create(req, res) {
  const parsed = createProductSchema.safeParse({
    title: req.body.title,
    description: req.body.description,
    price: Number(req.body.price),
    stock: Number(req.body.stock)
  });
  if (!parsed.success) {
    return res.status(400).json({ error: { message: 'Dados inválidos', details: parsed.error.issues } });
  }
  if (!req.file) {
    return res.status(400).json({ error: { message: 'Imagem do produto é obrigatória' } });
  }
  const created = await productService.createProduct({
    ...parsed.data,
    imageBuffer: req.file.buffer,
    imageMime: req.file.mimetype,
    imageName: req.file.originalname
  }, req.user.sub);
  res.status(201).json({ product: created });
}

export async function update(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: { message: 'ID inválido' } });
  }
  const parsed = updateProductSchema.safeParse({
    title: req.body.title,
    description: req.body.description,
    price: req.body.price !== undefined ? Number(req.body.price) : undefined,
    stock: req.body.stock !== undefined ? Number(req.body.stock) : undefined
  });
  if (!parsed.success) {
    return res.status(400).json({ error: { message: 'Dados inválidos', details: parsed.error.issues } });
  }
  const payload = { ...parsed.data };
  if (req.file) {
    payload.imageBuffer = req.file.buffer;
    payload.imageMime = req.file.mimetype;
    payload.imageName = req.file.originalname;
  }
  const updated = await productService.updateProduct(id, payload, req.user);
  res.json({ product: updated });
}

export async function list(req, res) {
  const products = await productService.listProducts();
  res.json({ products });
}

export async function getById(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: { message: 'ID inválido' } });
  const product = await productService.getProduct(id);
  if (!product) return res.status(404).json({ error: { message: 'Produto não encontrado' } });
  res.json({ product });
}

export async function image(req, res) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: { message: 'ID inválido' } });
  const img = await productService.getProductImage(id);
  res.setHeader('Content-Type', img.mime);
  res.setHeader('Content-Disposition', `inline; filename="${img.name}"`);
  res.send(Buffer.from(img.buffer));
}

export async function remove(req, res) {
  const id = Number(req.params.id);
  const result = await productService.removeProduct(id, req.user);
  res.json(result);
}
