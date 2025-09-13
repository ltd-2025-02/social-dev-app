
import React, { useEffect, useState, useCallback } from 'react';
import { StatusBar, View } from 'react-native';
import { Provider } from 'react-redux';
import { PaperProvider, MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { store } from './src/store';
import AppNavigator from './src/navigation/AppNavigator';
import { ThemeProvider, useTheme } from './src/contexts/ThemeContext';
import * as SplashScreen from 'expo-splash-screen';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

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
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here
        // await Font.loadAsync(Entypo.font);
        // Artificially delay for two seconds to simulate a slow loading
        // experience. Please remove this if you copy and paste the code!
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // This tells the splash screen to hide immediately! If we didn't call this,
      // we would see the splash screen fade out after a default amount of time.
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <Provider store={store}>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}
