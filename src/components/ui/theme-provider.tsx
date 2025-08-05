import React, { createContext, useContext, useEffect, useState } from 'react';
import { designTokens, generateCSSCustomProperties } from '@/lib/design-system';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  actualTheme: 'light' | 'dark';
  designTokens: typeof designTokens;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'angiday-theme',
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );

  const [actualTheme, setActualTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove previous theme classes
    root.classList.remove('light', 'dark');
    
    let resolvedTheme: 'light' | 'dark';
    
    if (theme === 'system') {
      resolvedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    } else {
      resolvedTheme = theme;
    }
    
    root.classList.add(resolvedTheme);
    setActualTheme(resolvedTheme);
    
    // Generate and apply CSS custom properties
    const cssVars = generateCSSCustomProperties();
    Object.entries(cssVars).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(storageKey, theme);
  }, [theme, storageKey]);

  const value: ThemeContextType = {
    theme,
    setTheme,
    actualTheme,
    designTokens,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
};

// Theme-aware component utilities
export const useDesignTokens = () => {
  const { designTokens } = useTheme();
  return designTokens;
};

export const useColorValue = (colorPath: string) => {
  const tokens = useDesignTokens();
  const keys = colorPath.split('.');
  let value: any = tokens.colors;
  
  for (const key of keys) {
    value = value[key];
    if (value === undefined) return null;
  }
  
  return value;
};

// CSS-in-JS utilities for styled components
export const createThemeAwareStyles = (styleFunction: (tokens: typeof designTokens) => any) => {
  return (props: any) => {
    const tokens = useDesignTokens();
    return styleFunction(tokens);
  };
};

// Responsive utilities
export const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState<keyof typeof designTokens.screens>('sm');
  
  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      
      if (width >= 1536) setBreakpoint('2xl');
      else if (width >= 1280) setBreakpoint('xl');
      else if (width >= 1024) setBreakpoint('lg');
      else if (width >= 768) setBreakpoint('md');
      else setBreakpoint('sm');
    };
    
    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);
    
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);
  
  return breakpoint;
};

// Animation utilities
export const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
  
  return prefersReducedMotion;
};

// Component variant utilities
export const getVariantClasses = (
  component: string,
  variant: string,
  size?: string
) => {
  const tokens = designTokens;
  // This would be expanded based on component variants
  // For now, return basic classes
  return '';
};

// Dark mode utilities
export const useDarkMode = () => {
  const { actualTheme, setTheme } = useTheme();
  
  const toggleDarkMode = () => {
    setTheme(actualTheme === 'dark' ? 'light' : 'dark');
  };
  
  return {
    isDark: actualTheme === 'dark',
    toggle: toggleDarkMode,
  };
};

// Color scheme utilities
export const useColorScheme = () => {
  const { actualTheme } = useTheme();
  const tokens = useDesignTokens();
  
  const getColor = (colorPath: string) => {
    const keys = colorPath.split('.');
    let value: any = tokens.colors;
    
    for (const key of keys) {
      value = value[key];
      if (value === undefined) return null;
    }
    
    return value;
  };
  
  const getSemanticColor = (semantic: 'primary' | 'secondary' | 'success' | 'warning' | 'error') => {
    return {
      50: getColor(`${semantic}.50`),
      100: getColor(`${semantic}.100`),
      200: getColor(`${semantic}.200`),
      300: getColor(`${semantic}.300`),
      400: getColor(`${semantic}.400`),
      500: getColor(`${semantic}.500`),
      600: getColor(`${semantic}.600`),
      700: getColor(`${semantic}.700`),
      800: getColor(`${semantic}.800`),
      900: getColor(`${semantic}.900`),
    };
  };
  
  return {
    theme: actualTheme,
    getColor,
    getSemanticColor,
    primary: getSemanticColor('primary'),
    secondary: getSemanticColor('secondary'),
    success: getSemanticColor('success'),
    warning: getSemanticColor('warning'),
    error: getSemanticColor('error'),
  };
};
