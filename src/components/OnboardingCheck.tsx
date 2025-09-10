import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { onboardingUtils } from '../utils/onboarding';
import WelcomeScreen from '../screens/onboarding/WelcomeScreen';

interface OnboardingCheckProps {
  children: React.ReactNode;
  navigation?: any;
}

export default function OnboardingCheck({ children, navigation }: OnboardingCheckProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [shouldShowOnboarding, setShouldShowOnboarding] = useState(false);
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    checkOnboardingStatus();
  }, [isAuthenticated, user]);

  const checkOnboardingStatus = async () => {
    try {
      if (!isAuthenticated || !user) {
        setIsLoading(false);
        return;
      }

      // Verificar se deve mostrar onboarding
      const shouldShow = await onboardingUtils.shouldShowOnboarding();
      setShouldShowOnboarding(shouldShow);
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      setShouldShowOnboarding(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnboardingComplete = async () => {
    try {
      await onboardingUtils.completeOnboarding();
      setShouldShowOnboarding(false);
    } catch (error) {
      console.error('Error completing onboarding:', error);
      setShouldShowOnboarding(false);
    }
  };

  // Mostrar loading enquanto verifica status
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  // Se deve mostrar onboarding e usuário está autenticado
  if (shouldShowOnboarding && isAuthenticated) {
    return (
      <WelcomeScreen 
        navigation={navigation}
        onComplete={handleOnboardingComplete}
      />
    );
  }

  // Renderizar conteúdo normal
  return <>{children}</>;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
});