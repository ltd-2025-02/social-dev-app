import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions } from 'react-native';

interface TabTransitionProps {
  children: React.ReactNode;
  isActive: boolean;
  animationType?: 'slide' | 'fade' | 'scale';
}

const { width: screenWidth } = Dimensions.get('window');

export default function TabTransition({ 
  children, 
  isActive, 
  animationType = 'slide' 
}: TabTransitionProps) {
  const slideAnim = useRef(new Animated.Value(isActive ? 0 : screenWidth)).current;
  const fadeAnim = useRef(new Animated.Value(isActive ? 1 : 0)).current;
  const scaleAnim = useRef(new Animated.Value(isActive ? 1 : 0.9)).current;

  useEffect(() => {
    if (animationType === 'slide') {
      Animated.timing(slideAnim, {
        toValue: isActive ? 0 : screenWidth,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else if (animationType === 'fade') {
      Animated.timing(fadeAnim, {
        toValue: isActive ? 1 : 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    } else if (animationType === 'scale') {
      Animated.spring(scaleAnim, {
        toValue: isActive ? 1 : 0.9,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }).start();
      
      Animated.timing(fadeAnim, {
        toValue: isActive ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [isActive, animationType]);

  const getAnimatedStyle = () => {
    switch (animationType) {
      case 'slide':
        return {
          transform: [{ translateX: slideAnim }],
        };
      case 'fade':
        return {
          opacity: fadeAnim,
        };
      case 'scale':
        return {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        };
      default:
        return {};
    }
  };

  return (
    <Animated.View style={[{ flex: 1 }, getAnimatedStyle()]}>
      {children}
    </Animated.View>
  );
}