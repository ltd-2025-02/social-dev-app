
import React from 'react';
import { StatusBar, View } from 'react-native';
import { Provider } from 'react-redux';
import { PaperProvider, MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { store } from './src/store';
import AppNavigator from './src/navigation/AppNavigator';
import { ThemeProvider, useTheme } from './src/contexts/ThemeContext';

function AppContent() {
  const { isDark, colors } = useTheme();
  
  // Create Paper theme with proper font configuration
  const paperTheme = {
    ...(isDark ? MD3DarkTheme : MD3LightTheme),
    colors: {
      ...(isDark ? MD3DarkTheme.colors : MD3LightTheme.colors),
      primary: colors.primary,
      surface: colors.surface,
      background: colors.background,
    },
    fonts: {
      ...MD3LightTheme.fonts,
      displayLarge: {
        ...MD3LightTheme.fonts.displayLarge,
        fontFamily: 'System',
      },
      displayMedium: {
        ...MD3LightTheme.fonts.displayMedium,
        fontFamily: 'System',
      },
      displaySmall: {
        ...MD3LightTheme.fonts.displaySmall,
        fontFamily: 'System',
      },
      headlineLarge: {
        ...MD3LightTheme.fonts.headlineLarge,
        fontFamily: 'System',
      },
      headlineMedium: {
        ...MD3LightTheme.fonts.headlineMedium,
        fontFamily: 'System',
      },
      headlineSmall: {
        ...MD3LightTheme.fonts.headlineSmall,
        fontFamily: 'System',
      },
      titleLarge: {
        ...MD3LightTheme.fonts.titleLarge,
        fontFamily: 'System',
      },
      titleMedium: {
        ...MD3LightTheme.fonts.titleMedium,
        fontFamily: 'System',
      },
      titleSmall: {
        ...MD3LightTheme.fonts.titleSmall,
        fontFamily: 'System',
      },
      labelLarge: {
        ...MD3LightTheme.fonts.labelLarge,
        fontFamily: 'System',
      },
      labelMedium: {
        ...MD3LightTheme.fonts.labelMedium,
        fontFamily: 'System',
      },
      labelSmall: {
        ...MD3LightTheme.fonts.labelSmall,
        fontFamily: 'System',
      },
      bodyLarge: {
        ...MD3LightTheme.fonts.bodyLarge,
        fontFamily: 'System',
      },
      bodyMedium: {
        ...MD3LightTheme.fonts.bodyMedium,
        fontFamily: 'System',
      },
      bodySmall: {
        ...MD3LightTheme.fonts.bodySmall,
        fontFamily: 'System',
      },
    }
  };
  
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar 
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
        translucent={false}
      />
      <PaperProvider theme={paperTheme}>
        <AppNavigator />
      </PaperProvider>
    </View>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}
