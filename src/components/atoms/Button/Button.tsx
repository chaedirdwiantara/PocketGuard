import React from 'react';
import { TouchableOpacity, TouchableOpacityProps, StyleSheet, ActivityIndicator } from 'react-native';
import { Text } from '../Text/Text';
import { colors } from '@theme/colors';
import { spacing, borderRadius } from '@theme/spacing';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends TouchableOpacityProps {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  fullWidth?: boolean;
  color?: string;
}

export const Button = ({
  label,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  color: customColor, // Rename to avoid conflict if any, though prop is custom
  disabled,
  style,
  ...props
}: ButtonProps) => {
  const isOutline = variant === 'outline';
  const isGhost = variant === 'ghost';
  
  const getBackgroundColor = () => {
    if (disabled) return colors.textTertiary;
    if (isOutline || isGhost) return 'transparent';
    if (variant === 'secondary') return colors.surface;
    return customColor || colors.primary;
  };

  const getTextColor = () => {
    if (disabled) return colors.background;
    if (isOutline || isGhost) return customColor || colors.primary;
    if (variant === 'secondary') return customColor || colors.textPrimary;
    return colors.onPrimary;
  };

  const containerStyles = [
    styles.container,
    { backgroundColor: getBackgroundColor() },
    isOutline && { borderWidth: 1, borderColor: customColor || colors.primary },
    size === 'sm' && styles.sizeSm,
    size === 'md' && styles.sizeMd,
    size === 'lg' && styles.sizeLg,
    fullWidth && styles.fullWidth,
    style,
  ];

  return (
    <TouchableOpacity
      style={containerStyles}
      disabled={disabled || isLoading}
      activeOpacity={0.8}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <Text 
          variant={size === 'lg' ? 'h2' : 'body'} 
          weight="medium"
          color={getTextColor()}
        >
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.md,
  },
  sizeSm: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  sizeMd: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  sizeLg: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  fullWidth: {
    width: '100%',
  },
});
