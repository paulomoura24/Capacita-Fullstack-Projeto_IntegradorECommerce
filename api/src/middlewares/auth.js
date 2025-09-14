import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';

export function authRequired(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) {
    return res.status(401).json({ error: { message: 'Token ausente', code: 'AUTH_REQUIRED' } });
  }
  try {
    const payload = jwt.verify(token, config.jwtSecret);
    req.user = payload;
    return next();
  } catch (e) {
    return res.status(401).json({ error: { message: 'Token inválido', code: 'INVALID_TOKEN' } });
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: { message: 'Acesso negado', code: 'FORBIDDEN' } });
    }
    next();
  };
}
