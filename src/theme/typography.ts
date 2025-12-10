import { TextStyle } from 'react-native';
import { colors } from './colors';
import { sizes } from './spacing';

export const weight = {
    regular: '400' as const,
    medium: '500' as const,
    semiBold: '600' as const,
    bold: '700' as const,
};

export const typography = {
    weight,
    sizes: sizes.text,
};

type TextStyleKeys = 'h1' | 'h2' | 'h3' | 'body' | 'caption';

export const textStyles: Record<TextStyleKeys, TextStyle> = {
    h1: {
        fontFamily: 'System',
        fontSize: sizes.text.xl,
        fontWeight: weight.bold,
        lineHeight: 34,
        letterSpacing: 0.36,
    },
    h2: {
        fontFamily: 'System',
        fontSize: sizes.text.lg,
        fontWeight: weight.bold,
        lineHeight: 28,
    },
    h3: {
        fontFamily: 'System',
        fontSize: sizes.text.md,
        fontWeight: weight.semiBold,
        lineHeight: 24,
    },
    body: {
        fontFamily: 'System',
        fontSize: sizes.text.md,
        fontWeight: weight.regular,
        lineHeight: 22,
    },
    caption: {
        fontFamily: 'System',
        fontSize: sizes.text.sm,
        fontWeight: weight.regular,
        lineHeight: 18,
        letterSpacing: 0.2,
    },
};
