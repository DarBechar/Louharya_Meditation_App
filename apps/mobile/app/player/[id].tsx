import { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useMeditation } from '../../hooks/useMeditations';
import { useAudioPlayer } from '../../hooks/useAudioPlayer';
import { useMeditationSession } from '../../hooks/useMeditationSession';
import { StepGuide } from '../../components/StepGuide';
import { Colors, Spacing, FontSize } from '../../constants/theme';

export default function PlayerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: meditation } = useMeditation(id);
  const { isPlaying, progress, toggle } = useAudioPlayer(meditation?.audioUrl ?? undefined);
  const { phase, currentStep, startSession, pauseSession, resumeSession, completeSession, advanceStep } = useMeditationSession(id);

  useEffect(() => {
    startSession();
  }, []);

  const handleToggle = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (phase === 'active') pauseSession();
    else resumeSession();
    await toggle();
  };

  const handleNext = async () => {
    if (!meditation?.steps) return;
    if (currentStep >= meditation.steps.length - 1) {
      await completeSession();
      Alert.alert('Practice complete', 'Well done. Your session has been recorded.', [
        { text: 'Return', onPress: () => router.back() },
      ]);
    } else {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      advanceStep(meditation.steps.length);
    }
  };

  const totalSeconds = (meditation?.durationMinutes ?? 0) * 60;
  const elapsed = Math.floor(progress * totalSeconds);
  const remaining = totalSeconds - elapsed;
  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <LinearGradient colors={['#0A0520', '#0D0D0D']} style={StyleSheet.absoluteFillObject} />
      <SafeAreaView style={styles.safe}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.close}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.timer}>{fmt(remaining)}</Text>
        </View>

        <Text style={styles.title} numberOfLines={2}>{meditation?.title}</Text>

        <View style={styles.progress}>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
          </View>
        </View>

        {meditation?.steps && (
          <StepGuide steps={meditation.steps} currentStep={currentStep} />
        )}

        <View style={styles.controls}>
          <TouchableOpacity style={styles.playBtn} onPress={handleToggle}>
            <Text style={styles.playIcon}>{isPlaying ? '⏸' : '▶'}</Text>
          </TouchableOpacity>

          {meditation?.steps && (
            <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
              <Text style={styles.nextText}>
                {currentStep >= (meditation.steps.length - 1) ? 'Complete' : 'Next step →'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, paddingHorizontal: Spacing.lg, gap: Spacing.lg },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: Spacing.sm },
  close: { color: Colors.textMuted, fontSize: FontSize.lg },
  timer: { color: Colors.textMuted, fontSize: FontSize.md, fontVariant: ['tabular-nums'] },
  title: { color: Colors.text, fontSize: FontSize.xxl, fontWeight: '800', lineHeight: 36 },
  progress: { height: 3 },
  progressTrack: { height: 3, backgroundColor: Colors.border, borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: Colors.accent },
  controls: { marginTop: 'auto', paddingBottom: Spacing.xl, alignItems: 'center', gap: Spacing.lg },
  playBtn: { width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.accent, alignItems: 'center', justifyContent: 'center' },
  playIcon: { fontSize: 28, color: Colors.text },
  nextBtn: { paddingVertical: Spacing.sm, paddingHorizontal: Spacing.lg },
  nextText: { color: Colors.accentSoft, fontSize: FontSize.md, fontWeight: '600' },
});
