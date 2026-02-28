import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const details: Record<string, string[]> = {};
      for (const issue of result.error.issues) {
        const key = issue.path.join('.');
        details[key] = [...(details[key] ?? []), issue.message];
      }
      res.status(400).json({ success: false, error: 'Validation failed', details });
      return;
    }
    req.body = result.data;
    next();
  };
}
