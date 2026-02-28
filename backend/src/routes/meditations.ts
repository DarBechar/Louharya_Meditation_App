import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  const { categoryId, level, search } = req.query;

  const meditations = await prisma.meditation.findMany({
    where: {
      isPublished: true,
      ...(categoryId ? { categoryId: String(categoryId) } : {}),
      ...(level ? { level: String(level) as any } : {}),
      ...(search
        ? {
            OR: [
              { title: { contains: String(search), mode: 'insensitive' } },
              { description: { contains: String(search), mode: 'insensitive' } },
              { tags: { has: String(search) } },
            ],
          }
        : {}),
    },
    orderBy: { order: 'asc' },
    include: {
      category: { select: { id: true, name: true, color: true, icon: true } },
    },
  });

  res.json(meditations);
});

router.get('/featured', async (_req: Request, res: Response) => {
  const meditations = await prisma.meditation.findMany({
    where: { isPublished: true },
    orderBy: { order: 'asc' },
    take: 3,
    include: {
      category: { select: { id: true, name: true, color: true, icon: true } },
    },
  });
  res.json(meditations);
});

router.get('/:id', async (req: Request, res: Response) => {
  const meditation = await prisma.meditation.findUnique({
    where: { id: req.params.id },
    include: {
      category: { select: { id: true, name: true, color: true, icon: true } },
    },
  });

  if (!meditation || !meditation.isPublished) {
    res.status(404).json({ error: 'Meditation not found' });
    return;
  }

  res.json(meditation);
});

export default router;
