import type { LouharPracticeDomain } from './meditation';

export type SessionStatus = 'in_progress' | 'completed' | 'abandoned';

export interface MeditationSession {
  id: string;
  userId: string;
  meditationId: string;
  status: SessionStatus;
  durationCompletedSeconds: number;
  completionPercent: number;
  lastStepReached?: number;
  notes?: string;
  startedAt: string;
  completedAt?: string;
}

export interface UserStats {
  totalSessionsCompleted: number;
  totalMinutesMeditated: number;
  currentStreakDays: number;
  longestStreakDays: number;
  favoritesDomain?: LouharPracticeDomain;
  sessionsThisWeek: number;
}
