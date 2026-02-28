import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../config/database';

const updateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  avatarUrl: z.string().url().optional(),
});

export async function getMe(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: { id: true, email: true, name: true, avatarUrl: true, createdAt: true },
    });
    if (!user) { res.status(404).json({ success: false, error: 'Not found' }); return; }
    res.json({ success: true, data: { ...user, createdAt: user.createdAt.toISOString() } });
  } catch (err) { next(err); }
}

export async function updateMe(req: Request, res: Response, next: NextFunction) {
  try {
    const data = updateSchema.parse(req.body);
    const user = await prisma.user.update({
      where: { id: req.user!.userId },
      data,
      select: { id: true, email: true, name: true, avatarUrl: true, createdAt: true },
    });
    res.json({ success: true, data: { ...user, createdAt: user.createdAt.toISOString() } });
  } catch (err) { next(err); }
}

export async function getFavorites(req: Request, res: Response, next: NextFunction) {
  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId: req.user!.userId },
      include: { meditation: { include: { category: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: favorites.map(f => f.meditation) });
  } catch (err) { next(err); }
}

export async function addFavorite(req: Request, res: Response, next: NextFunction) {
  try {
    await prisma.favorite.upsert({
      where: { userId_meditationId: { userId: req.user!.userId, meditationId: req.params.medId } },
      update: {},
      create: { userId: req.user!.userId, meditationId: req.params.medId },
    });
    res.status(201).json({ success: true, data: null });
  } catch (err) { next(err); }
}

export async function removeFavorite(req: Request, res: Response, next: NextFunction) {
  try {
    await prisma.favorite.deleteMany({
      where: { userId: req.user!.userId, meditationId: req.params.medId },
    });
    res.json({ success: true, data: null });
  } catch (err) { next(err); }
}
