import { prisma } from '../prisma/client.js';
import { hashPassword, comparePassword } from '../utils/hash.js';
import { signJwt } from '../utils/jwt.js';

export async function register({ name, email, password, role }) {
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) {
    const err = new Error('Email já cadastrado');
    err.status = 409;
    throw err;
  }
  const hash = await hashPassword(password);
  const user = await prisma.user.create({
    data: { name, email, password: hash, role: role || 'CLIENT' }
  });
  const token = signJwt({ sub: user.id, email: user.email, role: user.role });
  return { user: { id: user.id, name: user.name, email: user.email, role: user.role }, token };
}

export async function login({ email, password }) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    const err = new Error('Credenciais inválidas');
    err.status = 401;
    throw err;
  }
  const ok = await comparePassword(password, user.password);
  if (!ok) {
    const err = new Error('Credenciais inválidas');
    err.status = 401;
    throw err;
  }
  const token = signJwt({ sub: user.id, email: user.email, role: user.role });
  return { user: { id: user.id, name: user.name, email: user.email, role: user.role }, token };
}
