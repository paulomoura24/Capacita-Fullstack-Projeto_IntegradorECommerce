import { Router } from 'express';
import { authRequired, requireRole } from '../middlewares/auth.js';
import * as ctrl from '../controllers/order.controller.js';

const r = Router();
r.post('/', authRequired, requireRole('CLIENT','ADMIN'), ctrl.create);
r.get('/', authRequired, ctrl.listMy);
r.get('/:id', authRequired, ctrl.getOne);
export default r;
