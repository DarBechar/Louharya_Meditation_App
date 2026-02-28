import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { router } from './routes';
import { errorHandler } from './middleware/errorHandler';
import { env } from './config/env';

export function createApp() {
  const app = express();
  app.use(helmet());
  app.use(cors({ origin: env.ALLOWED_ORIGINS }));
  app.use(express.json());
  app.get('/health', (_req, res) => res.json({ status: 'ok' }));
  app.use('/api', router);
  app.use(errorHandler);
  return app;
}
