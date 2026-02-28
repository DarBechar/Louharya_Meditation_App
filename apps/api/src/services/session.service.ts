import { prisma } from '../config/database';

export async function startSession(userId: string, meditationId: string) {
  const meditation = await prisma.meditation.findUnique({ where: { id: meditationId } });
  if (!meditation) throw Object.assign(new Error('Meditation not found'), { statusCode: 404 });

  return prisma.meditationSession.create({
    data: { userId, meditationId, status: 'in_progress' },
  });
}

export async function updateSession(
  sessionId: string,
  userId: string,
  data: {
    durationCompletedSeconds?: number;
    completionPercent?: number;
    lastStepReached?: number;
    notes?: string;
    status?: 'completed' | 'abandoned';
  }
) {
  const completedAt = data.status === 'completed' ? new Date() : undefined;
  return prisma.meditationSession.update({
    where: { id: sessionId, userId },
    data: { ...data, ...(completedAt && { completedAt }) },
  });
}

export async function getUserSessions(userId: string) {
  return prisma.meditationSession.findMany({
    where: { userId },
    include: { meditation: { include: { category: true } } },
    orderBy: { startedAt: 'desc' },
    take: 50,
  });
}

export async function getUserStats(userId: string) {
  const sessions = await prisma.meditationSession.findMany({
    where: { userId, status: 'completed' },
    orderBy: { completedAt: 'desc' },
    include: { meditation: { select: { durationMinutes: true, category: true } } },
  });

  const totalMinutes = sessions.reduce((sum, s) => sum + s.meditation.durationMinutes, 0);
  const streak = computeStreak(sessions.map(s => s.completedAt!));
  const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

  return {
    totalSessionsCompleted: sessions.length,
    totalMinutesMeditated: totalMinutes,
    currentStreakDays: streak.current,
    longestStreakDays: streak.longest,
    sessionsThisWeek: sessions.filter(s => new Date(s.completedAt!).getTime() > oneWeekAgo).length,
  };
}

function computeStreak(dates: Date[]): { current: number; longest: number } {
  if (!dates.length) return { current: 0, longest: 0 };
  const days = [...new Set(dates.map(d => d.toISOString().split('T')[0]))].sort().reverse();
  let current = 1, longest = 1, run = 1;
  for (let i = 1; i < days.length; i++) {
    const diff = (new Date(days[i - 1]).getTime() - new Date(days[i]).getTime()) / 86400000;
    run = diff === 1 ? run + 1 : 1;
    if (i === 1) current = run;
    longest = Math.max(longest, run);
  }
  return { current, longest };
}
