import { Request, Response, NextFunction } from 'express';
import * as meditationService from '../services/meditation.service';

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const { category, domain, difficulty, page, pageSize, featured } = req.query;
    const result = await meditationService.getMeditations({
      category: category as string,
      domain: domain as string,
      difficulty: difficulty as string,
      page: page ? parseInt(page as string) : undefined,
      pageSize: pageSize ? parseInt(pageSize as string) : undefined,
      featured: featured === 'true',
    });
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
}

export async function featured(req: Request, res: Response, next: NextFunction) {
  try {
    const items = await meditationService.getFeaturedMeditations();
    res.json({ success: true, data: items });
  } catch (err) { next(err); }
}

export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const meditation = await meditationService.getMeditationById(req.params.id);
    res.json({ success: true, data: meditation });
  } catch (err) { next(err); }
}
