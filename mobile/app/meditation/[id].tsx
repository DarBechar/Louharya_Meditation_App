import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Audio } from 'expo-av';
import { getMeditation, logSession } from '@/services/api';
import { Meditation, GuideStep } from '@/types';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';

type PlayerState = 'idle' | 'playing' | 'paused' | 'completed';

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default function MeditationPlayerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [meditation, setMeditation] = useState<Meditation | null>(null);
  const [loading, setLoading] = useState(true);
  const [playerState, setPlayerState] = useState<PlayerState>('idle');
  const [elapsed, setElapsed] = useState(0);
  const [currentStep, setCurrentStep] = useState<GuideStep | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const elapsedRef = useRef(0);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    getMeditation(id)
      .then(setMeditation)
      .finally(() => setLoading(false));

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      sound?.unloadAsync();
    };
  }, [id]);

  // Find the current guide step based on elapsed time
  const updateStep = useCallback((elapsed: number, steps: GuideStep[]) => {
    const active = [...steps]
      .filter((s) => s.time <= elapsed)
      .sort((a, b) => b.time - a.time)[0];
    setCurrentStep(active ?? null);
  }, []);

  function startTimer() {
    startTimeRef.current = Date.now() - elapsedRef.current * 1000;
    intervalRef.current = setInterval(() => {
      if (!meditation) return;
      const now = Date.now();
      const newElapsed = Math.floor((now - startTimeRef.current!) / 1000);

      elapsedRef.current = newElapsed;
      setElapsed(newElapsed);
      updateStep(newElapsed, meditation.guideSteps as GuideStep[]);

      if (newElapsed >= meditation.duration) {
        handleComplete(newElapsed);
      }
    }, 500);
  }

  function stopTimer() {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }

  async function handleStart() {
    if (!meditation) return;

    // Load audio if available
    if (meditation.audioUrl && !sound) {
      try {
        await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
        const { sound: s } = await Audio.Sound.createAsync({ uri: meditation.audioUrl });
        setSound(s);
        await s.playAsync();
      } catch {
        // Audio failed — continue with text-only guidance
      }
    } else {
      await sound?.playAsync();
    }

    setPlayerState('playing');
    startTimer();
  }

  async function handlePause() {
    stopTimer();
    await sound?.pauseAsync();
    setPlayerState('paused');
  }

  async function handleResume() {
    await sound?.playAsync();
    setPlayerState('playing');
    startTimer();
  }

  async function handleComplete(durationComplete: number) {
    stopTimer();
    await sound?.stopAsync();
    setPlayerState('completed');

    try {
      await logSession({ meditationId: meditation!.id, durationComplete });
    } catch {
      // session logging failed — non-critical
    }
  }

  function handleClose() {
    if (playerState === 'playing' || playerState === 'paused') {
      Alert.alert('End meditation?', 'Your progress will be saved.', [
        { text: 'Continue', style: 'cancel' },
        {
          text: 'End',
          style: 'destructive',
          onPress: async () => {
            stopTimer();
            await sound?.stopAsync();
            if (elapsedRef.current > 10) {
              await logSession({
                meditationId: meditation!.id,
                durationComplete: elapsedRef.current,
              }).catch(() => {});
            }
            router.back();
          },
        },
      ]);
    } else {
      router.back();
    }
  }

  if (loading) {
    return (
      <LinearGradient colors={['#0F0A1E', '#1A0F2E']} style={styles.gradient}>
        <ActivityIndicator color={Colors.primary} style={{ flex: 1 }} />
      </LinearGradient>
    );
  }

  if (!meditation) {
    return (
      <LinearGradient colors={['#0F0A1E', '#1A0F2E']} style={styles.gradient}>
        <SafeAreaView style={styles.safe}>
          <Text style={styles.errorText}>Meditation not found.</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backLink}>Go back</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  const progress = Math.min(elapsed / meditation.duration, 1);
  const steps = meditation.guideSteps as GuideStep[];

  return (
    <LinearGradient colors={['#0F0A1E', '#1A0F2E', '#0F0A1E']} style={styles.gradient}>
      <SafeAreaView style={styles.safe}>
        {/* Close button */}
        <TouchableOpacity style={styles.closeBtn} onPress={handleClose}>
          <Text style={styles.closeBtnText}>✕</Text>
        </TouchableOpacity>

        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {/* Category & title */}
          <Text style={[styles.categoryLabel, { color: meditation.category.color }]}>
            {meditation.category.name}
          </Text>
          <Text style={styles.title}>{meditation.title}</Text>
          <Text style={styles.description}>{meditation.description}</Text>

          {/* Progress ring / timer */}
          <View style={styles.timerSection}>
            <View style={[styles.timerRing, { borderColor: meditation.category.color + '44' }]}>
              <View
                style={[
                  styles.timerProgress,
                  {
                    borderColor: meditation.category.color,
                    transform: [{ rotate: `${progress * 360}deg` }],
                  },
                ]}
              />
              <View style={styles.timerInner}>
                <Text style={styles.timerText}>
                  {playerState === 'completed'
                    ? 'Complete'
                    : formatTime(meditation.duration - elapsed)}
                </Text>
                <Text style={styles.timerSubtext}>
                  {playerState === 'idle'
                    ? `${Math.floor(meditation.duration / 60)} min`
                    : playerState === 'completed'
                    ? 'Well done'
                    : 'remaining'}
                </Text>
              </View>
            </View>
          </View>

          {/* Current guide step */}
          <View style={styles.guideCard}>
            {playerState === 'idle' ? (
              <Text style={styles.guideText}>{meditation.description}</Text>
            ) : currentStep ? (
              <Text style={styles.guideText}>{currentStep.text}</Text>
            ) : (
              <Text style={styles.guideTextMuted}>Prepare yourself. Begin when ready.</Text>
            )}
          </View>

          {/* Controls */}
          <View style={styles.controls}>
            {playerState === 'idle' && (
              <TouchableOpacity
                style={[styles.playBtn, { backgroundColor: meditation.category.color }]}
                onPress={handleStart}
              >
                <Text style={styles.playBtnText}>Begin Meditation</Text>
              </TouchableOpacity>
            )}

            {playerState === 'playing' && (
              <TouchableOpacity style={styles.controlBtn} onPress={handlePause}>
                <Text style={styles.controlBtnText}>Pause</Text>
              </TouchableOpacity>
            )}

            {playerState === 'paused' && (
              <TouchableOpacity
                style={[styles.playBtn, { backgroundColor: meditation.category.color }]}
                onPress={handleResume}
              >
                <Text style={styles.playBtnText}>Resume</Text>
              </TouchableOpacity>
            )}

            {playerState === 'completed' && (
              <View style={styles.completedSection}>
                <Text style={styles.completedTitle}>Practice complete</Text>
                <Text style={styles.completedText}>
                  You completed {formatTime(elapsedRef.current)} of meditation. Well done.
                </Text>
                <TouchableOpacity
                  style={[styles.playBtn, { backgroundColor: meditation.category.color }]}
                  onPress={() => router.back()}
                >
                  <Text style={styles.playBtnText}>Return</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Guide steps overview */}
          {playerState === 'idle' && steps.length > 0 && (
            <View style={styles.stepsSection}>
              <Text style={styles.stepsTitle}>What to expect</Text>
              {steps.map((step, i) => (
                <View key={i} style={styles.stepRow}>
                  <Text style={styles.stepTime}>{formatTime(step.time)}</Text>
                  <Text style={styles.stepText}>{step.text}</Text>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safe: { flex: 1 },
  scroll: { padding: Spacing.lg, paddingBottom: Spacing.xxl },
  closeBtn: {
    position: 'absolute',
    top: Spacing.xl,
    right: Spacing.lg,
    zIndex: 10,
    padding: Spacing.sm,
  },
  closeBtnText: { fontSize: FontSize.lg, color: Colors.textMuted },
  categoryLabel: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: Spacing.sm,
    marginTop: Spacing.lg,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: '300',
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
    lineHeight: 36,
  },
  description: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: Spacing.xl,
  },
  timerSection: { alignItems: 'center', marginBottom: Spacing.xl },
  timerRing: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  timerProgress: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 3,
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  timerInner: { alignItems: 'center' },
  timerText: {
    fontSize: FontSize.xxxl,
    fontWeight: '200',
    color: Colors.textPrimary,
    letterSpacing: 2,
  },
  timerSubtext: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: Spacing.xs },
  guideCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    minHeight: 80,
    justifyContent: 'center',
  },
  guideText: {
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    lineHeight: 26,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  guideTextMuted: {
    fontSize: FontSize.md,
    color: Colors.textMuted,
    lineHeight: 26,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  controls: { alignItems: 'center', marginBottom: Spacing.xl },
  playBtn: {
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.md,
  },
  playBtnText: { fontSize: FontSize.md, fontWeight: '600', color: Colors.white },
  controlBtn: {
    borderWidth: 1,
    borderColor: Colors.textMuted,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
  },
  controlBtnText: { fontSize: FontSize.md, color: Colors.textSecondary },
  completedSection: { alignItems: 'center', gap: Spacing.md },
  completedTitle: { fontSize: FontSize.xl, fontWeight: '300', color: Colors.textPrimary },
  completedText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  stepsSection: { marginTop: Spacing.md },
  stepsTitle: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    fontSize: FontSize.xs,
  },
  stepRow: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
    gap: Spacing.md,
  },
  stepTime: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    fontVariant: ['tabular-nums'],
    minWidth: 36,
    marginTop: 2,
  },
  stepText: {
    flex: 1,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  errorText: {
    color: Colors.textPrimary,
    fontSize: FontSize.lg,
    textAlign: 'center',
    marginTop: Spacing.xxl,
  },
  backLink: { color: Colors.primary, textAlign: 'center', marginTop: Spacing.md },
});
