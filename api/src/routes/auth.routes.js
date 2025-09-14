import { Router } from 'express';
import * as ctrl from '../controllers/auth.controller.js';

const r = Router();
r.post('/register', ctrl.register);
r.post('/login', ctrl.login);
export default r;
