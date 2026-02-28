export type LouharPracticeDomain =
  | 'consciousness'
  | 'transformation'
  | 'self-frequency'
  | 'resilience'
  | 'inner-connection'
  | 'integration';

export type MeditationDifficulty = 'beginner' | 'intermediate' | 'advanced';
export type MeditationFormat = 'guided_audio' | 'guided_steps' | 'ambient';

export interface MeditationStep {
  order: number;
  durationSeconds: number;
  title: string;
  instruction: string;
  breathingCue?: 'inhale' | 'exhale' | 'hold' | 'natural';
}

export interface MeditationContent {
  audioUrl?: string;
  steps?: MeditationStep[];
  introText?: string;
  backgroundMusicUrl?: string;
}

export interface Meditation {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  durationMinutes: number;
  domain: LouharPracticeDomain;
  difficulty: MeditationDifficulty;
  format: MeditationFormat;
  thumbnailUrl?: string;
  isFeatured: boolean;
  isPublished: boolean;
  content: MeditationContent;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  domain: LouharPracticeDomain;
  description: string;
  iconName: string;
  color: string;
  meditationCount: number;
}
