import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { Meditation } from '@louharya/shared';
import { Colors, Spacing, FontSize, Radius } from '../constants/theme';

interface MeditationCardProps {
  meditation: Meditation;
  onPress: () => void;
  compact?: boolean;
}

export function MeditationCard({ meditation, onPress, compact }: MeditationCardProps) {
  return (
    <TouchableOpacity style={[styles.card, compact && styles.compact]} onPress={onPress} activeOpacity={0.85}>
      <LinearGradient
        colors={['#1A1A2E', '#16213E']}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text style={styles.domain}>{meditation.domain}</Text>
          <Text style={styles.duration}>{meditation.durationMinutes} min</Text>
        </View>
        <Text style={styles.title} numberOfLines={2}>{meditation.title}</Text>
        {!compact && (
          <Text style={styles.description} numberOfLines={2}>{meditation.description}</Text>
        )}
        <View style={styles.footer}>
          <Text style={styles.level}>{meditation.difficulty}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.lg,
    overflow: 'hidden',
    minHeight: 160,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  compact: { minHeight: 110 },
  content: { padding: Spacing.md, gap: Spacing.xs, flex: 1 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  domain: { color: Colors.accent, fontSize: FontSize.xs, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1 },
  duration: { color: Colors.textMuted, fontSize: FontSize.xs },
  title: { color: Colors.text, fontSize: FontSize.lg, fontWeight: '700', lineHeight: 24, marginTop: Spacing.xs },
  description: { color: Colors.textMuted, fontSize: FontSize.sm, lineHeight: 20 },
  footer: { marginTop: 'auto', paddingTop: Spacing.sm },
  level: { color: Colors.gold, fontSize: FontSize.xs, fontWeight: '500', textTransform: 'capitalize' },
});
