import React from 'react';
import { Text as RNText, TextStyle } from 'react-native';
import { colors } from '@theme/colors';
import { typography, textStyles } from '@theme/typography';

export type TextVariant = keyof typeof textStyles;

interface TextProps extends RNTextProps {
  variant?: TextVariant;
  color?: string;
  weight?: keyof typeof typography.weight;
  centered?: boolean;
}

export const Text = ({ 
  style, 
  variant = 'body', 
  color = colors.textPrimary,
  weight,
  centered,
  children,
  ...props 
}: TextProps) => {
  const baseStyle = textStyles[variant];
  
  const customStyle: TextStyle = {
    color,
    ...(weight ? { fontWeight: typography.weight[weight] } : {}),
    ...(centered ? { textAlign: 'center' } : {}),
  };

  return (
    <RNText style={[baseStyle, customStyle, style]} {...props}>
      {children}
    </RNText>
  );
};
