import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Animated, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ThemeColors {
  // Background colors
  background: string;
  surface: string;
  card: string;
  
  // Text colors
  text: string;
  textSecondary: string;
  textMuted: string;
  
  // Primary colors
  primary: string;
  primaryText: string;
  
  // Status colors
  success: string;
  warning: string;
  error: string;
  info: string;
  
  // UI elements
  border: string;
  shadow: string;
  overlay: string;
  
  // Header
  headerBackground: string;
  headerText: string;
  
  // Button
  buttonBackground: string;
  buttonText: string;
  
  // Input
  inputBackground: string;
  inputBorder: string;
  inputText: string;
  placeholder: string;
}

const lightTheme: ThemeColors = {
  background: '#f8fafc',
  surface: '#ffffff',
  card: '#ffffff',
  
  text: '#1f2937',
  textSecondary: '#374151',
  textMuted: '#6b7280',
  
  primary: '#667eea',
  primaryText: '#ffffff',
  
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
  
  border: '#e5e7eb',
  shadow: '#000000',
  overlay: 'rgba(0, 0, 0, 0.5)',
  
  headerBackground: '#ffffff',
  headerText: '#1f2937',
  
  buttonBackground: '#667eea',
  buttonText: '#ffffff',
  
  inputBackground: '#ffffff',
  inputBorder: '#d1d5db',
  inputText: '#1f2937',
  placeholder: '#9ca3af',
};

const darkTheme: ThemeColors = {
  background: '#0f172a',
  surface: '#1e293b',
  card: '#334155',
  
  text: '#f8fafc',
  textSecondary: '#e2e8f0',
  textMuted: '#94a3b8',
  
  primary: '#8b5cf6',
  primaryText: '#ffffff',
  
  success: '#22c55e',
  warning: '#eab308',
  error: '#f87171',
  info: '#60a5fa',
  
  border: '#475569',
  shadow: '#000000',
  overlay: 'rgba(0, 0, 0, 0.7)',
  
  headerBackground: '#1e293b',
  headerText: '#f8fafc',
  
  buttonBackground: '#8b5cf6',
  buttonText: '#ffffff',
  
  inputBackground: '#334155',
  inputBorder: '#475569',
  inputText: '#f8fafc',
  placeholder: '#64748b',
};

interface ThemeContextType {
  isDark: boolean;
  colors: ThemeColors;
  toggleTheme: () => void;
  animatedValue: Animated.Value;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  const [animatedValue] = useState(new Animated.Value(0));

  useEffect(() => {
    loadTheme();
  }, []);

  useEffect(() => {
    // Update status bar style based on theme
    StatusBar.setBarStyle(isDark ? 'light-content' : 'dark-content', true);
  }, [isDark]);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme');
      const isDarkMode = savedTheme === 'dark';
      setIsDark(isDarkMode);
      
      // Set initial animated value without animation
      animatedValue.setValue(isDarkMode ? 1 : 0);
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  };

  const saveTheme = async (theme: string) => {
    try {
      await AsyncStorage.setItem('theme', theme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    saveTheme(newTheme ? 'dark' : 'light');

    // Animate the transition
    Animated.timing(animatedValue, {
      toValue: newTheme ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const colors = isDark ? darkTheme : lightTheme;

  const value: ThemeContextType = {
    isDark,
    colors,
    toggleTheme,
    animatedValue,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Utility function to create animated styles
export const createAnimatedStyle = (
  animatedValue: Animated.Value,
  lightValue: any,
  darkValue: any
) => {
  return animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [lightValue, darkValue],
  });
};