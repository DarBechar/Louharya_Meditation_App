import { Router } from 'express';
import { authenticate } from '../middleware/authenticate';
import * as ctrl from '../controllers/sessions.controller';

export const sessionsRouter = Router();
sessionsRouter.use(authenticate);
sessionsRouter.post('/', ctrl.start);
sessionsRouter.patch('/:id', ctrl.update);
sessionsRouter.get('/', ctrl.history);
sessionsRouter.get('/stats', ctrl.stats);
