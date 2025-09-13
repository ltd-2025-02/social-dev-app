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
  
  // Dracula Specific Colors
  purple: string;      // #bd93f9
  pink: string;        // #ff79c6
  cyan: string;        // #8be9fd
  green: string;       // #50fa7b
  orange: string;      // #ffb86c
  red: string;         // #ff5555
  yellow: string;      // #f1fa8c
  
  // Additional UI
  accent: string;
  selection: string;
  comment: string;
  foreground: string;
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
  
  // Light theme equivalents
  purple: '#8b5cf6',
  pink: '#ec4899',
  cyan: '#06b6d4',
  green: '#10b981',
  orange: '#f59e0b',
  red: '#ef4444',
  yellow: '#eab308',
  
  accent: '#667eea',
  selection: '#e0e7ff',
  comment: '#6b7280',
  foreground: '#1f2937',
};

const darkTheme: ThemeColors = {
  // Dracula Official Color Palette
  background: '#282a36',      // Background
  surface: '#44475a',         // Current Line
  card: '#373844',            // Darker card variant
  
  // Dracula Text Colors
  text: '#f8f8f2',           // Foreground
  textSecondary: '#e6e6e6',   // Slightly dimmed foreground
  textMuted: '#6272a4',       // Comment
  
  // Dracula Purple as Primary
  primary: '#bd93f9',         // Purple
  primaryText: '#282a36',     // Background for contrast
  
  // Dracula Authentic Status Colors
  success: '#50fa7b',         // Green
  warning: '#ffb86c',         // Orange  
  error: '#ff5555',           // Red
  info: '#8be9fd',            // Cyan
  
  // Dracula UI Elements
  border: '#6272a4',          // Comment color for borders
  shadow: '#191a21',          // Darker shadow
  overlay: 'rgba(40, 42, 54, 0.9)',
  
  // Dracula Header - Pure theme colors
  headerBackground: '#282a36',
  headerText: '#f8f8f2',
  
  // Dracula Button - Purple theme
  buttonBackground: '#bd93f9',
  buttonText: '#282a36',
  
  // Dracula Input
  inputBackground: '#44475a',
  inputBorder: '#6272a4',
  inputText: '#f8f8f2',
  placeholder: '#6272a4',
  
  // Official Dracula Color Palette
  purple: '#bd93f9',          // Purple
  pink: '#ff79c6',            // Pink
  cyan: '#8be9fd',            // Cyan
  green: '#50fa7b',           // Green
  orange: '#ffb86c',          // Orange
  red: '#ff5555',             // Red
  yellow: '#f1fa8c',          // Yellow
  
  // Dracula Additional UI
  accent: '#ff79c6',          // Pink as accent
  selection: '#44475a',       // Current Line for selections
  comment: '#6272a4',         // Comment
  foreground: '#f8f8f2',      // Foreground
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