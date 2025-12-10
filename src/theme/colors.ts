/**
 * PocketGuard Color Palette
 */

export const colors = {
    // Brand
    primary: '#3B82F6', // Blue-500
    onPrimary: '#FFFFFF',

    // Backgrounds
    background: '#FFFFFF',
    surface: '#F3F4F6', // Gray-100

    // Text
    textPrimary: '#111827', // Gray-900
    textSecondary: '#6B7280', // Gray-500
    textTertiary: '#9CA3AF', // Gray-400

    // Semantic
    success: '#10B981', // Green-500
    warning: '#F59E0B', // Amber-500
    error: '#EF4444', // Red-500
    info: '#3B82F6', // Blue-500

    // Priority Levels
    priority: {
        critical: '#EF4444',
        high: '#F59E0B',
        medium: '#3B82F6',
        low: '#10B981',
    },

    // Borders
    border: '#E5E7EB', // Gray-200

    transparent: 'transparent',
} as const;

export type Colors = typeof colors;
