import { useState, useCallback, useRef } from 'react';
import { api } from '../services/api';

export type SessionPhase = 'idle' | 'active' | 'paused' | 'completed';

export function useMeditationSession(meditationId: string) {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [phase, setPhase] = useState<SessionPhase>('idle');
  const [currentStep, setCurrentStep] = useState(0);
  const startTimeRef = useRef<number>(0);

  const startSession = useCallback(async () => {
    const { data } = await api.post('/sessions', { meditationId });
    setSessionId(data.data.id);
    setPhase('active');
    startTimeRef.current = Date.now();
  }, [meditationId]);

  const pauseSession = useCallback(() => {
    setPhase('paused');
  }, []);

  const resumeSession = useCallback(() => {
    setPhase('active');
  }, []);

  const completeSession = useCallback(async () => {
    if (!sessionId) return;
    const durationSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000);
    await api.patch(`/sessions/${sessionId}`, {
      status: 'COMPLETED',
      durationSeconds,
    });
    setPhase('completed');
  }, [sessionId]);

  const advanceStep = useCallback((total: number) => {
    setCurrentStep((s) => Math.min(s + 1, total - 1));
  }, []);

  return {
    sessionId,
    phase,
    currentStep,
    startSession,
    pauseSession,
    resumeSession,
    completeSession,
    advanceStep,
  };
}
