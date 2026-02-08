import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { defaultTheme, highContrastTheme, Theme } from './theme';

type ThemeContextValue = {
  theme: Theme;
  isHighContrast: boolean;
  toggleHighContrast: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isHighContrast, setIsHighContrast] = useState(false);
  const theme = isHighContrast ? highContrastTheme : defaultTheme;
  const toggleHighContrast = useCallback(() => setIsHighContrast((v) => !v), []);

  return (
    <ThemeContext.Provider value={{ theme, isHighContrast, toggleHighContrast }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
