import { NuiStateProvider } from './hooks/nuiState';
import GlobalStyles from './styles/global';
import Appearance from './components/Appearance';
import { ThemeProvider } from 'styled-components';
import React, { createContext, useState, useCallback, useMemo } from 'react';

// Dark Theme (Default)
const darkTheme = {
  id: 'dark',
  borderRadius: '16px',
  fontColor: '255, 255, 255',
  fontColorHover: '255, 255, 255',
  fontColorSelected: '255, 255, 255',
  fontFamily: 'Inter',
  primaryBackground: '12, 12, 13', // Charcoal/Black
  primaryBackgroundSelected: '10, 213, 140', // Vibrant Emerald
  secondaryBackground: '19, 19, 21', // Dark Card Grey
  accent: '10, 213, 140',
  scaleOnHover: true,
  sectionFontWeight: '600',
  smoothBackgroundTransition: true,
  // Custom properties
  cardBorder: 'rgba(255, 255, 255, 0.04)',
  headerBackground: 'rgba(19, 19, 21, 0.9)',
  // UI Kit Variables (HSL)
  uiKitPrimary: '160 90% 44%', // Vibrant Emerald HSL
  uiKitBackground: '240 4% 5%', // Almost black HSL
  uiKitCard: '240 5% 8%',   // Lighter black HSL
};

// Light Theme
const lightTheme = {
  id: 'light',
  borderRadius: '12px',
  fontColor: '17, 24, 39', // gray-900 (stronger)
  fontColorHover: '0, 0, 0', // black
  fontColorSelected: '255, 255, 255',
  fontFamily: 'Inter',
  primaryBackground: '243, 244, 246', // gray-100
  primaryBackgroundSelected: '139, 92, 246', // violet-500
  secondaryBackground: '255, 255, 255', // white
  accent: '139, 92, 246', // violet-500
  scaleOnHover: true,
  sectionFontWeight: '600',
  smoothBackgroundTransition: true,
  // Custom for header
  cardBorder: 'rgba(0, 0, 0, 0.08)',
  headerBackground: 'rgba(0, 0, 0, 0.03)',
  buttonBackground: 'rgba(0, 0, 0, 0.05)',
};

interface ThemeContextInterface {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  accentColor: string;
  setAccentColor: (color: string) => void;
  contentColor: string;
  setContentColor: (color: string) => void;
  titleColor: string;
  setTitleColor: (color: string) => void;
  interfaceScale: number;
  setInterfaceScale: (scale: number) => void;
  language: string;
  setLanguage: (lang: string) => void;
  layout: 'accordion' | 'tabs';
  setLayout: (layout: 'accordion' | 'tabs') => void;
}

export const ThemeToggleContext = createContext<ThemeContextInterface>({
  theme: 'dark',
  toggleTheme: () => { },
  setTheme: () => { },
  accentColor: '10, 213, 140',
  setAccentColor: () => { },
  contentColor: '255, 255, 255',
  setContentColor: () => { },
  titleColor: '255, 255, 255',
  setTitleColor: () => { },
  interfaceScale: 100,
  setInterfaceScale: () => { },
  language: 'Português (BR)',
  setLanguage: () => { },
  layout: 'accordion',
  setLayout: () => { },
});

const App: React.FC = () => {
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('dark');
  const [accentColor, setAccentColor] = useState('10, 213, 140'); // Default emerald
  const [contentColor, setContentColor] = useState('255, 255, 255'); // Default white
  const [titleColor, setTitleColor] = useState('255, 255, 255'); // Default white
  const [interfaceScale, setInterfaceScale] = useState(98); // Matches image
  const [language, setLanguage] = useState('Português (BR)');
  const [layout, setLayout] = useState<'accordion' | 'tabs'>('tabs');

  const toggleTheme = useCallback(() => {
    setThemeMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  React.useEffect(() => {
    if (themeMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [themeMode]);

  const currentTheme = useMemo(() => {
    const base = themeMode === 'dark' ? darkTheme : lightTheme;
    return {
      ...base,
      accent: accentColor,
      primaryBackgroundSelected: accentColor,
      fontColor: contentColor,
      fontColorHover: contentColor,
      fontColorSelected: contentColor,
      titleColor: titleColor,
    };
  }, [themeMode, accentColor, contentColor, titleColor]);

  return (
    <NuiStateProvider>
      <ThemeToggleContext.Provider value={{
        theme: themeMode,
        toggleTheme,
        setTheme: setThemeMode,
        accentColor,
        setAccentColor,
        contentColor,
        setContentColor,
        titleColor,
        setTitleColor,
        interfaceScale,
        setInterfaceScale,
        language,
        setLanguage,
        layout,
        setLayout
      }}>
        <ThemeProvider theme={currentTheme}>
          <Appearance />
          <GlobalStyles />
        </ThemeProvider>
      </ThemeToggleContext.Provider>
    </NuiStateProvider>
  );
};

export default App;
