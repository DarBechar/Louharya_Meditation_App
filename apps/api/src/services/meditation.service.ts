import { prisma } from '../config/database';
import type { Meditation } from '@louharya/shared';

function toMeditation(m: any): Meditation {
  return {
    id: m.id,
    title: m.title,
    subtitle: m.subtitle ?? undefined,
    description: m.description,
    durationMinutes: m.durationMinutes,
    domain: m.category?.domain ?? m.domain,
    difficulty: m.difficulty,
    format: m.format,
    thumbnailUrl: m.thumbnailUrl ?? undefined,
    isFeatured: m.isFeatured,
    isPublished: m.isPublished,
    content: m.content as any,
    tags: m.tags,
    createdAt: m.createdAt.toISOString(),
    updatedAt: m.updatedAt.toISOString(),
  };
}

export async function getMeditations(params: {
  category?: string;
  domain?: string;
  difficulty?: string;
  page?: number;
  pageSize?: number;
  featured?: boolean;
}) {
  const page = Math.max(1, params.page ?? 1);
  const pageSize = Math.min(50, Math.max(1, params.pageSize ?? 20));
  const skip = (page - 1) * pageSize;

  const where: any = { isPublished: true };
  if (params.category) where.categoryId = params.category;
  if (params.domain) where.category = { domain: params.domain };
  if (params.difficulty) where.difficulty = params.difficulty;
  if (params.featured === true) where.isFeatured = true;

  const [items, total] = await Promise.all([
    prisma.meditation.findMany({
      where,
      include: { category: true },
      orderBy: [{ isFeatured: 'desc' }, { sortOrder: 'asc' }, { createdAt: 'desc' }],
      skip,
      take: pageSize,
    }),
    prisma.meditation.count({ where }),
  ]);

  return {
    items: items.map(toMeditation),
    total,
    page,
    pageSize,
    hasNextPage: skip + items.length < total,
  };
}

export async function getMeditationById(id: string) {
  const m = await prisma.meditation.findFirst({
    where: { id, isPublished: true },
    include: { category: true },
  });
  if (!m) throw Object.assign(new Error('Meditation not found'), { statusCode: 404 });
  return toMeditation(m);
}

export async function getFeaturedMeditations() {
  const items = await prisma.meditation.findMany({
    where: { isFeatured: true, isPublished: true },
    include: { category: true },
    orderBy: { sortOrder: 'asc' },
    take: 5,
  });
  return items.map(toMeditation);
}
