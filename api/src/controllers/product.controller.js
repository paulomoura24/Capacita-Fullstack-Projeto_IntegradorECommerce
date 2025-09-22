import { createProductSchema, updateProductSchema } from '../validators/product.schemas.js'
import * as productService from '../services/product.service.js'

function decodeBase64Image(b64) {
  try {
    return Buffer.from(String(b64).trim(), 'base64')
  } catch {
    return null
  }
}

export async function create(req, res) {
  const parsed = createProductSchema.safeParse({
    title: req.body.title,
    description: req.body.description,
    price: Number(req.body.price),
    stock: Number(req.body.stock),
  })
  if (!parsed.success) {
    return res.status(400).json({ message: 'Dados inválidos', details: parsed.error.issues })
  }

  let imageBuffer = null
  let imageMime = null
  let imageName = null

  if (req.file) {
    imageBuffer = req.file.buffer
    imageMime = req.file.mimetype
    imageName = req.file.originalname
  } else if (req.body?.imageBase64) {
    const buf = decodeBase64Image(req.body.imageBase64)
    if (!buf) return res.status(400).json({ message: 'imageBase64 inválido' })
    imageBuffer = buf
    imageMime = req.body.imageMime || 'application/octet-stream'
    imageName = req.body.imageName || 'upload.bin'
  }

  if (!imageBuffer) {
    return res.status(400).json({ message: 'Imagem do produto é obrigatória' })
  }

  const created = await productService.createProduct(
    { ...parsed.data, imageBuffer, imageMime, imageName },
    req.user?.sub
  )
  return res.status(201).json({ product: created })
}

export async function update(req, res) {
  const id = Number(req.params.id)
  if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ message: 'ID inválido' })

  const parsed = updateProductSchema.safeParse({
    title: req.body.title,
    description: req.body.description,
    price: req.body.price !== undefined ? Number(req.body.price) : undefined,
    stock: req.body.stock !== undefined ? Number(req.body.stock) : undefined,
  })
  if (!parsed.success) {
    return res.status(400).json({ message: 'Dados inválidos', details: parsed.error.issues })
  }

  const payload = { ...parsed.data }

  if (req.file) {
    payload.imageBuffer = req.file.buffer
    payload.imageMime = req.file.mimetype
    payload.imageName = req.file.originalname
  } else if (req.body?.imageBase64) {
    const buf = decodeBase64Image(req.body.imageBase64)
    if (!buf) return res.status(400).json({ message: 'imageBase64 inválido' })
    payload.imageBuffer = buf
    payload.imageMime = req.body.imageMime || 'application/octet-stream'
    payload.imageName = req.body.imageName || 'upload.bin'
  }

  const updated = await productService.updateProduct(id, payload, req.user)
  return res.json({ product: updated })
}

export async function list(req, res) {
  const products = await productService.listProducts()
  res.json({ products })
}

export async function getById(req, res) {
  const id = Number(req.params.id)
  if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ message: 'ID inválido' })
  const product = await productService.getProduct(id)
  if (!product) return res.status(404).json({ message: 'Produto não encontrado' })
  res.json({ product })
}

export async function image(req, res) {
  const id = Number(req.params.id)
  if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ message: 'ID inválido' })
  const img = await productService.getProductImage(id)
  res.setHeader('Content-Type', img.mime)
  res.setHeader('Content-Disposition', `inline; filename="${img.name}"`)
  res.send(Buffer.from(img.buffer))
}

export async function remove(req, res) {
  const id = Number(req.params.id)
  const result = await productService.removeProduct(id, req.user)
  res.json(result)
}
