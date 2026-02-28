import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { MeditationStep } from '@louharya/shared';
import { Colors, Spacing, FontSize, Radius } from '../constants/theme';

interface StepGuideProps {
  steps: MeditationStep[];
  currentStep: number;
}

export function StepGuide({ steps, currentStep }: StepGuideProps) {
  const step = steps[currentStep];
  if (!step) return null;

  return (
    <View style={styles.container}>
      <View style={styles.indicators}>
        {steps.map((_, i) => (
          <View
            key={i}
            style={[styles.dot, i === currentStep && styles.dotActive, i < currentStep && styles.dotDone]}
          />
        ))}
      </View>
      <View style={styles.card}>
        <Text style={styles.stepLabel}>Step {currentStep + 1} of {steps.length}</Text>
        <Text style={styles.title}>{step.title}</Text>
        <Text style={styles.instruction}>{step.instruction}</Text>
        {step.durationSeconds && (
          <Text style={styles.duration}>{step.durationSeconds}s</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: Spacing.md },
  indicators: { flexDirection: 'row', gap: Spacing.xs, justifyContent: 'center' },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.border },
  dotActive: { backgroundColor: Colors.accent, width: 24 },
  dotDone: { backgroundColor: Colors.accentSoft },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  stepLabel: { color: Colors.textMuted, fontSize: FontSize.xs, textTransform: 'uppercase', letterSpacing: 1 },
  title: { color: Colors.text, fontSize: FontSize.xl, fontWeight: '700' },
  instruction: { color: Colors.textMuted, fontSize: FontSize.md, lineHeight: 24 },
  duration: { color: Colors.accent, fontSize: FontSize.sm, fontWeight: '600' },
});
