import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import meditationRoutes from './routes/meditations';
import categoryRoutes from './routes/categories';
import sessionRoutes from './routes/sessions';
import userRoutes from './routes/users';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/meditations', meditationRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/users', userRoutes);

app.listen(PORT, () => {
  console.log(`Louharya API running on port ${PORT}`);
});

export default app;
