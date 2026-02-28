import { Router } from 'express';
import { authenticate } from '../middleware/authenticate';
import * as ctrl from '../controllers/auth.controller';

export const authRouter = Router();
authRouter.post('/register', ctrl.register);
authRouter.post('/login', ctrl.login);
authRouter.get('/me', authenticate, ctrl.me);
authRouter.post('/logout', authenticate, ctrl.logout);
