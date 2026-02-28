import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import * as sessionService from '../services/session.service';

const startSchema = z.object({ meditationId: z.string() });
const updateSchema = z.object({
  durationCompletedSeconds: z.number().int().min(0).optional(),
  completionPercent: z.number().int().min(0).max(100).optional(),
  lastStepReached: z.number().int().min(0).optional(),
  notes: z.string().max(2000).optional(),
  status: z.enum(['completed', 'abandoned']).optional(),
});

export async function start(req: Request, res: Response, next: NextFunction) {
  try {
    const { meditationId } = startSchema.parse(req.body);
    const session = await sessionService.startSession(req.user!.userId, meditationId);
    res.status(201).json({ success: true, data: session });
  } catch (err) { next(err); }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const data = updateSchema.parse(req.body);
    const session = await sessionService.updateSession(req.params.id, req.user!.userId, data);
    res.json({ success: true, data: session });
  } catch (err) { next(err); }
}

export async function history(req: Request, res: Response, next: NextFunction) {
  try {
    const sessions = await sessionService.getUserSessions(req.user!.userId);
    res.json({ success: true, data: sessions });
  } catch (err) { next(err); }
}

export async function stats(req: Request, res: Response, next: NextFunction) {
  try {
    const userStats = await sessionService.getUserStats(req.user!.userId);
    res.json({ success: true, data: userStats });
  } catch (err) { next(err); }
}
