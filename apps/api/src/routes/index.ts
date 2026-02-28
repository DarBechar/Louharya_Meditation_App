import { Router } from 'express';
import { authRouter } from './auth.routes';
import { meditationsRouter } from './meditations.routes';
import { sessionsRouter } from './sessions.routes';
import { categoriesRouter } from './categories.routes';
import { usersRouter } from './users.routes';

export const router = Router();
router.use('/auth', authRouter);
router.use('/meditations', meditationsRouter);
router.use('/sessions', sessionsRouter);
router.use('/categories', categoriesRouter);
router.use('/users', usersRouter);
