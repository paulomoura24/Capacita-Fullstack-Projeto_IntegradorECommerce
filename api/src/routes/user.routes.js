import { Router } from 'express';
import { authRequired } from '../middlewares/auth.js';
import * as ctrl from '../controllers/user.controller.js';

const r = Router();
r.get('/me', authRequired, ctrl.me);
export default r;
