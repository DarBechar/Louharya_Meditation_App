import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Category } from '../types';
import { Colors, Spacing, FontSize, BorderRadius } from '../constants/theme';

interface Props {
  category: Category;
  onPress: () => void;
  selected?: boolean;
}

export default function CategoryChip({ category, onPress, selected }: Props) {
  return (
    <TouchableOpacity
      style={[
        styles.chip,
        selected && { backgroundColor: category.color + '33', borderColor: category.color },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={[styles.dot, { backgroundColor: category.color }]} />
      <Text style={[styles.name, selected && { color: Colors.textPrimary }]}>{category.name}</Text>
      {category._count !== undefined && (
        <Text style={styles.count}>{category._count.meditations}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginRight: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.surfaceElevated,
    gap: Spacing.xs,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  name: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  count: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
});
