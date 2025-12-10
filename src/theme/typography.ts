/**
 * PocketGuard Typography System
 */

export const typography = {
    size: {
        xs: 12,
        sm: 14,
        md: 16,
        lg: 20,
        xl: 24,
        xxl: 32,
    },
    weight: {
        regular: '400',
        medium: '500',
        bold: '700',
    } as const,
    lineHeight: {
        tight: 1.25,
        normal: 1.5,
        relaxed: 1.75,
    },
} as const;

// Text styles helper
export const textStyles = {
    h1: {
        fontSize: typography.size.xxl,
        fontWeight: typography.weight.bold,
        lineHeight: typography.size.xxl * typography.lineHeight.tight,
    },
    h2: {
        fontSize: typography.size.xl,
        fontWeight: typography.weight.bold,
        lineHeight: typography.size.xl * typography.lineHeight.tight,
    },
    body: {
        fontSize: typography.size.md,
        fontWeight: typography.weight.regular,
        lineHeight: typography.size.md * typography.lineHeight.normal,
    },
    caption: {
        fontSize: typography.size.sm,
        fontWeight: typography.weight.medium,
        lineHeight: typography.size.sm * typography.lineHeight.normal,
    },
} as const;
