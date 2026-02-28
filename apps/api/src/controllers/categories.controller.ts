import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';

export async function list(_req: Request, res: Response, next: NextFunction) {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { sortOrder: 'asc' },
      include: { _count: { select: { meditations: true } } },
    });
    const data = categories.map(c => ({
      id: c.id,
      name: c.name,
      domain: c.domain,
      description: c.description,
      iconName: c.iconName,
      color: c.color,
      meditationCount: c._count.meditations,
    }));
    res.json({ success: true, data });
  } catch (err) { next(err); }
}

export async function getCategoryMeditations(req: Request, res: Response, next: NextFunction) {
  try {
    const meditations = await prisma.meditation.findMany({
      where: { categoryId: req.params.id, isPublished: true },
      include: { category: true },
      orderBy: { sortOrder: 'asc' },
    });
    res.json({ success: true, data: meditations });
  } catch (err) { next(err); }
}
