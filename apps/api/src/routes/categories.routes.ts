import { Router } from 'express';
import * as ctrl from '../controllers/categories.controller';

export const categoriesRouter = Router();
categoriesRouter.get('/', ctrl.list);
categoriesRouter.get('/:id/meditations', ctrl.getCategoryMeditations);
