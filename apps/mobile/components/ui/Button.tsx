import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Spacing, FontSize, Radius } from '../../constants/theme';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export function Button({ label, onPress, variant = 'primary', loading, disabled, style }: ButtonProps) {
  const bg = variant === 'primary' ? Colors.accent
    : variant === 'secondary' ? Colors.surface
    : 'transparent';
  const border = variant === 'secondary' ? Colors.border : 'transparent';
  const color = variant === 'ghost' ? Colors.accent : Colors.text;

  return (
    <TouchableOpacity
      style={[styles.base, { backgroundColor: bg, borderColor: border, borderWidth: variant === 'secondary' ? 1 : 0 }, style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={color} />
      ) : (
        <Text style={[styles.label, { color }]}>{label}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 52,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
  },
  label: {
    fontSize: FontSize.md,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});
