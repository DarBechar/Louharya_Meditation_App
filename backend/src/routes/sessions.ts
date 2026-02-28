import { Router, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();

const CreateSessionSchema = z.object({
  meditationId: z.string().uuid(),
  durationComplete: z.number().int().min(0),
  notes: z.string().optional(),
});

// Log a completed session
router.post('/', requireAuth, async (req: AuthRequest, res: Response) => {
  const parse = CreateSessionSchema.safeParse(req.body);
  if (!parse.success) {
    res.status(400).json({ error: parse.error.flatten() });
    return;
  }

  const session = await prisma.session.create({
    data: {
      userId: req.userId!,
      meditationId: parse.data.meditationId,
      durationComplete: parse.data.durationComplete,
      notes: parse.data.notes,
    },
    include: {
      meditation: { select: { title: true, duration: true } },
    },
  });

  res.status(201).json(session);
});

// Get session history for the authenticated user
router.get('/me', requireAuth, async (req: AuthRequest, res: Response) => {
  const sessions = await prisma.session.findMany({
    where: { userId: req.userId! },
    orderBy: { completedAt: 'desc' },
    take: 50,
    include: {
      meditation: {
        select: {
          id: true,
          title: true,
          duration: true,
          category: { select: { name: true, color: true, icon: true } },
        },
      },
    },
  });

  const totalMinutes = sessions.reduce((acc, s) => acc + Math.floor(s.durationComplete / 60), 0);
  const totalSessions = sessions.length;

  res.json({ sessions, stats: { totalSessions, totalMinutes } });
});

export default router;
