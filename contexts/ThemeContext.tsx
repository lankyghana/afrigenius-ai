import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '@/constants/Colors';
import { StorageService } from '@/services/storage';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
  colors: typeof Colors.light;
  statusBarStyle: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load theme preference asynchronously without blocking render
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const preferences = await StorageService.getPreferences();
      const darkMode = preferences.theme === 'dark';
      setIsDarkMode(darkMode);
    } catch (error) {
      console.warn('Error loading theme preference:', error);
      // Use default light theme on error
      setIsDarkMode(false);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTheme = async () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    
    try {
      const preferences = await StorageService.getPreferences();
      await StorageService.savePreferences({
        ...preferences,
        theme: newDarkMode ? 'dark' : 'light',
      });
    } catch (error) {
      console.warn('Error saving theme preference:', error);
    }
  };

  // Use dynamic colors based on current theme state
  const colors = isDarkMode ? Colors.dark : Colors.light;
  const statusBarStyle = isDarkMode ? 'light' : 'dark';

  // Don't render children until theme is loaded to prevent flash
  if (isLoading) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, colors, statusBarStyle }}>
      <StatusBar style={statusBarStyle} backgroundColor={colors.background} />
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}