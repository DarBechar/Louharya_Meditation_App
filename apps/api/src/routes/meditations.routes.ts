import { Router } from 'express';
import * as ctrl from '../controllers/meditations.controller';

export const meditationsRouter = Router();
meditationsRouter.get('/', ctrl.list);
meditationsRouter.get('/featured', ctrl.featured);
meditationsRouter.get('/:id', ctrl.getById);
