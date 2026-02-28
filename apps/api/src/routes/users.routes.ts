import { Router } from 'express';
import { authenticate } from '../middleware/authenticate';
import * as ctrl from '../controllers/users.controller';

export const usersRouter = Router();
usersRouter.use(authenticate);
usersRouter.get('/me', ctrl.getMe);
usersRouter.patch('/me', ctrl.updateMe);
usersRouter.get('/me/favorites', ctrl.getFavorites);
usersRouter.post('/me/favorites/:medId', ctrl.addFavorite);
usersRouter.delete('/me/favorites/:medId', ctrl.removeFavorite);
