import { Router } from 'express';
import { authRequired, requireRole } from '../middlewares/auth.js';
import * as ctrl from '../controllers/product.controller.js';
import { uploadImage } from '../middlewares/upload.js';

const r = Router();
r.get('/', ctrl.list);
r.get('/:id', ctrl.getById);
r.get('/:id/image', ctrl.image);

r.post('/', authRequired, requireRole('VENDOR','ADMIN'), uploadImage, ctrl.create);
r.put('/:id', authRequired, requireRole('VENDOR','ADMIN'), uploadImage, ctrl.update);
r.delete('/:id', authRequired, requireRole('VENDOR','ADMIN'), ctrl.remove);

export default r;
