import { Router } from 'express';
import { authRequired, requireRole } from '../middlewares/auth.js';
import * as ctrl from '../controllers/user.controller.js';

const r = Router();
r.get('/me', authRequired, ctrl.me);
r.get('/', authRequired, requireRole('ADMIN'), ctrl.list);
export default r;

