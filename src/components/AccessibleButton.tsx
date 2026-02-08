import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

type AccessibleButtonProps = {
  label: string;
  hint?: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
};

const MIN_TOUCH = 44;

export function AccessibleButton({
  label,
  hint,
  onPress,
  variant = 'primary',
  style,
  textStyle,
  disabled = false,
}: AccessibleButtonProps) {
  const { theme } = useTheme();
  const bg =
    variant === 'danger'
      ? theme.colors.error
      : variant === 'secondary'
        ? theme.colors.border
        : theme.colors.primary;
  const textColor = variant === 'secondary' ? theme.colors.text : '#fff';

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.btn,
        { backgroundColor: bg, minHeight: theme.minTouchTargetSize },
        style,
      ]}
      accessible
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={hint ?? '두 번 탭하면 실행합니다.'}
      accessibilityState={{ disabled }}
    >
      <Text style={[styles.text, { color: textColor }, textStyle]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: MIN_TOUCH,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
});
