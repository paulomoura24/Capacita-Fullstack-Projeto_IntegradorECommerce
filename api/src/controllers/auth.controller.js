import { registerSchema, loginSchema } from '../validators/user.schemas.js';
import * as authService from '../services/auth.service.js';

export async function register(req, res) {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: { message: 'Dados inválidos', details: parsed.error.issues } });
  }
  const result = await authService.register(parsed.data);
  res.status(201).json(result);
}

export async function login(req, res) {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: { message: 'Dados inválidos', details: parsed.error.issues } });
  }
  const result = await authService.login(parsed.data);
  res.json(result);
}
