export const colors = {
  primary: '#4a7c59',
  primaryDark: '#3d6b4a',
  background: '#f8f9fa',
  surface: '#ffffff',
  text: '#1a1a2e',
  textSecondary: '#5c5c6d',
  border: '#e2e4e8',
  error: '#c53030',
  success: '#2d7d46',
  highContrast: {
    background: '#0d0d0d',
    surface: '#1a1a1a',
    text: '#ffffff',
    textSecondary: '#b0b0b0',
    border: '#404040',
  },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const minTouchTargetSize = 44;

export type Theme = {
  colors: typeof colors;
  spacing: typeof spacing;
  minTouchTargetSize: number;
  isHighContrast: boolean;
};

export const defaultTheme: Theme = {
  colors,
  spacing,
  minTouchTargetSize,
  isHighContrast: false,
};

export const highContrastTheme: Theme = {
  ...defaultTheme,
  colors: {
    ...colors,
    background: colors.highContrast.background,
    surface: colors.highContrast.surface,
    text: colors.highContrast.text,
    textSecondary: colors.highContrast.textSecondary,
    border: colors.highContrast.border,
  },
  isHighContrast: true,
};
