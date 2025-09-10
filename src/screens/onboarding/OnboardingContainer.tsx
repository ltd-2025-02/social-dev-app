import React, { useState } from 'react';
import SplashScreen from './SplashScreen';
import OnboardingScreen from './OnboardingScreen';

interface OnboardingContainerProps {
  onComplete: () => void;
}

export default function OnboardingContainer({ onComplete }: OnboardingContainerProps) {
  const [showOnboarding, setShowOnboarding] = useState(false);

  const handleGetStarted = () => {
    setShowOnboarding(true);
  };

  if (!showOnboarding) {
    return <SplashScreen onGetStarted={handleGetStarted} />;
  }

  return <OnboardingScreen onFinish={onComplete} />;
}