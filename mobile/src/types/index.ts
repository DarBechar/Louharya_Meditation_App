export type Level = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

export interface GuideStep {
  time: number; // seconds from start
  text: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  order: number;
  _count?: { meditations: number };
}

export interface Meditation {
  id: string;
  title: string;
  description: string;
  duration: number; // seconds
  categoryId: string;
  category: Pick<Category, 'id' | 'name' | 'color' | 'icon'>;
  audioUrl: string | null;
  guideSteps: GuideStep[];
  tags: string[];
  level: Level;
  isPublished: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface Session {
  id: string;
  meditationId: string;
  durationComplete: number;
  completedAt: string;
  notes?: string;
  meditation: {
    id: string;
    title: string;
    duration: number;
    category: Pick<Category, 'name' | 'color' | 'icon'>;
  };
}

export interface SessionStats {
  totalSessions: number;
  totalMinutes: number;
}
