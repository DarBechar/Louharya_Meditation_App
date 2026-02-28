import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Meditation } from '../types';
import { Colors, Spacing, FontSize, BorderRadius } from '../constants/theme';

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  return `${m} min`;
}

const LEVEL_LABELS: Record<string, string> = {
  BEGINNER: 'Beginner',
  INTERMEDIATE: 'Intermediate',
  ADVANCED: 'Advanced',
};

interface Props {
  meditation: Meditation;
  onPress: () => void;
}

export default function MeditationCard({ meditation, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={[styles.accent, { backgroundColor: meditation.category.color }]} />
      <View style={styles.content}>
        <View style={styles.meta}>
          <Text style={[styles.category, { color: meditation.category.color }]}>
            {meditation.category.name}
          </Text>
          <Text style={styles.duration}>{formatDuration(meditation.duration)}</Text>
        </View>
        <Text style={styles.title}>{meditation.title}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {meditation.description}
        </Text>
        <View style={styles.footer}>
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>{LEVEL_LABELS[meditation.level]}</Text>
          </View>
          {meditation.audioUrl && (
            <View style={styles.audioBadge}>
              <Text style={styles.audioText}>Audio</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  accent: { width: 4 },
  content: { flex: 1, padding: Spacing.md },
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  category: { fontSize: FontSize.xs, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.8 },
  duration: { fontSize: FontSize.xs, color: Colors.textMuted },
  title: {
    fontSize: FontSize.lg,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  description: { fontSize: FontSize.sm, color: Colors.textSecondary, lineHeight: 20 },
  footer: { flexDirection: 'row', marginTop: Spacing.sm, gap: Spacing.xs },
  levelBadge: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
  },
  levelText: { fontSize: FontSize.xs, color: Colors.textSecondary },
  audioBadge: {
    backgroundColor: Colors.primaryDark,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
  },
  audioText: { fontSize: FontSize.xs, color: Colors.primaryLight },
});
