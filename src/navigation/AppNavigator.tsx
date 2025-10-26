
import React, { useEffect, useState } from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../contexts/ThemeContext';

import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import LoadingScreen from '../screens/LoadingScreen';
import OnboardingContainer from '../screens/onboarding/OnboardingContainer';
import SplashScreen from '../screens/SplashScreen';
import { setOnboardingState, setOnboardingSeen } from '../store/slices/onboardingSlice';
import { getCurrentUser } from '../store/slices/authSlice';
import { supabase } from '../services/supabase';

// RootStackParamList type removed for JavaScript compatibility

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, loading: authLoading } = useSelector((state: RootState) => state.auth);
  const { hasSeenOnboarding, loading: onboardingLoading } = useSelector((state: RootState) => state.onboarding);
  const { isDark, colors } = useTheme();

  // Create custom Dracula theme for navigation
  const navigationTheme = {
    dark: isDark,
    colors: {
      primary: colors.primary,
      background: colors.background,
      card: colors.surface,
      text: colors.text,
      border: colors.border,
      notification: colors.error,
    },
    fonts: {
      regular: {
        fontFamily: 'System',
        fontWeight: 'normal',
      },
      medium: {
        fontFamily: 'System',
        fontWeight: '500',
      },
      bold: {
        fontFamily: 'System',
        fontWeight: '700',
      },
      light: {
        fontFamily: 'System',
        fontWeight: '300',
      },
      thin: {
        fontFamily: 'System',
        fontWeight: '100',
      },
      heavy: {
        fontFamily: 'System',
        fontWeight: '700',
      },
    },
  };

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const hasSeenOnboarding = await AsyncStorage.getItem('hasSeenOnboarding');
        dispatch(setOnboardingState(hasSeenOnboarding === 'true'));
      } catch (error) {
        console.error('Error checking onboarding status:', error);
        dispatch(setOnboardingState(false));
      }
    };

    checkOnboardingStatus();
  }, [dispatch]);

  useEffect(() => {
    dispatch(getCurrentUser());

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session ? 'session exists' : 'no session');
        
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          dispatch(getCurrentUser());
        } else if (event === 'SIGNED_OUT') {
          console.log('User signed out');
        }
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, [dispatch]);

  const handleOnboardingComplete = () => {
    dispatch(setOnboardingSeen());
  };

  // No JS splash screen — native splash handled in App.tsx

  if (authLoading || onboardingLoading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer theme={navigationTheme as any}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!hasSeenOnboarding ? (
          <Stack.Screen 
            name="Onboarding" 
            children={() => <OnboardingContainer onComplete={handleOnboardingComplete} />}
          />
        ) : isAuthenticated ? (
          <Stack.Screen name="Main" component={MainNavigator} />
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
