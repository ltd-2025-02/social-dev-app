
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import AsyncStorage from '@react-native-async-storage/async-storage';

import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import LoadingScreen from '../screens/LoadingScreen';
import OnboardingContainer from '../screens/onboarding/OnboardingContainer';
import { setOnboardingState, setOnboardingSeen } from '../store/slices/onboardingSlice';
import { getCurrentUser } from '../store/slices/authSlice';
import { supabase } from '../services/supabase';

// RootStackParamList type removed for JavaScript compatibility

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, loading: authLoading } = useSelector((state: RootState) => state.auth);
  const { hasSeenOnboarding, loading: onboardingLoading } = useSelector((state: RootState) => state.onboarding);

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

  if (authLoading || onboardingLoading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
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
