import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { spacing, borderRadius } from '@/constants/spacing';
import { typography, colors } from '@/constants/typography';

type Variant = 'primary' | 'secondary' | 'ghost' | 'pro';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
  textStyle,
}: ButtonProps) {
  const handlePress = () => {
    if (disabled || loading) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  const variantStyles = {
    primary: [styles.primary, disabled && styles.disabled] as ViewStyle[],
    secondary: [styles.secondary, disabled && styles.disabled] as ViewStyle[],
    ghost: [styles.ghost, disabled && styles.disabled] as ViewStyle[],
    pro: [styles.pro, disabled && styles.disabled] as ViewStyle[],
  };

  const textVariantStyles = {
    primary: styles.textPrimary,
    secondary: styles.textSecondary,
    ghost: styles.textGhost,
    pro: styles.textPro,
  };

  return (
    <TouchableOpacity
      testID="button"
      style={[styles.base, variantStyles[variant], style]}
      onPress={handlePress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' || variant === 'pro' ? colors.surface : colors.primary}
        />
      ) : (
        <Text style={[styles.text, textVariantStyles[variant], textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 52,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.surfaceSubtle,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  pro: {
    backgroundColor: colors.pro,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    ...typography.label,
  },
  textPrimary: {
    color: colors.surface,
  },
  textSecondary: {
    color: colors.text,
  },
  textGhost: {
    color: colors.primary,
  },
  textPro: {
    color: colors.surface,
  },
});
