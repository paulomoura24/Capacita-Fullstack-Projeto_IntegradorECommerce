import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';

export function signJwt(payload, expiresIn = '2h') {
  return jwt.sign(payload, config.jwtSecret, { expiresIn });
}
