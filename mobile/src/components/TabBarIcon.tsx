import React from 'react';
import { Text } from 'react-native';

// Simple icon component — replace with a real icon library like @expo/vector-icons
// Map of icon names to emoji/unicode for placeholder
const ICONS: Record<string, string> = {
  home: '⌂',
  'book-open': '◫',
  'bar-chart-2': '▦',
  user: '◯',
  play: '▶',
  pause: '⏸',
  'skip-back': '⏮',
  'skip-forward': '⏭',
  'chevron-left': '‹',
  'chevron-right': '›',
  x: '✕',
  check: '✓',
  radio: '◎',
  'align-center': '≡',
  layers: '⊞',
  aperture: '⊙',
  zap: '⚡',
};

interface Props {
  name: string;
  color: string;
  size?: number;
}

export default function TabBarIcon({ name, color, size = 22 }: Props) {
  return (
    <Text style={{ color, fontSize: size, lineHeight: size + 4 }}>
      {ICONS[name] ?? '•'}
    </Text>
  );
}
