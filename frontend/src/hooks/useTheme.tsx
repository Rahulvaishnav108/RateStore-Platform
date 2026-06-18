import * as React from 'react';
import { LOCAL_STORAGE_KEYS, THEMES } from '@/config/constants';
import type { Theme } from '@/types';

type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
  isLight: boolean;
  isSystem: boolean;
};

const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = React.useState<Theme>(() => {
    const savedTheme = localStorage.getItem(LOCAL_STORAGE_KEYS.THEME) as Theme;
    return savedTheme || THEMES.SYSTEM;
  });

  const isDark = theme === THEMES.DARK || 
    (theme === THEMES.SYSTEM && window.matchMedia('(prefers-color-scheme: dark)').matches);
  
  const isLight = theme === THEMES.LIGHT || 
    (theme === THEMES.SYSTEM && !window.matchMedia('(prefers-color-scheme: dark)').matches);
  
  const isSystem = theme === THEMES.SYSTEM;

  React.useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === THEMES.SYSTEM) {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches 
        ? 'dark' 
        : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  React.useEffect(() => {
    const handleChange = () => {
      if (theme === THEMES.SYSTEM) {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches 
          ? 'dark' 
          : 'light';
        root.classList.add(systemTheme);
      }
    };

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.THEME, newTheme);
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDark, isLight, isSystem }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = React.useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
