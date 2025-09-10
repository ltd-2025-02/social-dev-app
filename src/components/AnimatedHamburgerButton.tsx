import React, { useRef, useEffect } from 'react';
import { TouchableOpacity, Animated, StyleSheet } from 'react-native';

interface AnimatedHamburgerButtonProps {
  isOpen: boolean;
  onPress: () => void;
  size?: number;
  color?: string;
}

export default function AnimatedHamburgerButton({ 
  isOpen, 
  onPress, 
  size = 24, 
  color = '#1f2937' 
}: AnimatedHamburgerButtonProps) {
  const line1Rotate = useRef(new Animated.Value(0)).current;
  const line2Opacity = useRef(new Animated.Value(1)).current;
  const line3Rotate = useRef(new Animated.Value(0)).current;
  const line1TranslateY = useRef(new Animated.Value(0)).current;
  const line3TranslateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isOpen) {
      // Transform to X
      Animated.parallel([
        Animated.timing(line1Rotate, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(line2Opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(line3Rotate, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(line1TranslateY, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(line3TranslateY, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Transform to hamburger
      Animated.parallel([
        Animated.timing(line1Rotate, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(line2Opacity, {
          toValue: 1,
          duration: 300,
          delay: 100,
          useNativeDriver: true,
        }),
        Animated.timing(line3Rotate, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(line1TranslateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(line3TranslateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isOpen]);

  const line1Style = {
    transform: [
      {
        translateY: line1TranslateY.interpolate({
          inputRange: [0, 1],
          outputRange: [0, size * 0.3],
        }),
      },
      {
        rotate: line1Rotate.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '45deg'],
        }),
      },
    ],
  };

  const line2Style = {
    opacity: line2Opacity,
  };

  const line3Style = {
    transform: [
      {
        translateY: line3TranslateY.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -size * 0.3],
        }),
      },
      {
        rotate: line3Rotate.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '-45deg'],
        }),
      },
    ],
  };

  return (
    <TouchableOpacity
      style={[styles.button, { width: size + 16, height: size + 16 }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Animated.View
        style={[
          styles.line,
          { 
            width: size, 
            height: size * 0.1, 
            backgroundColor: color,
            marginBottom: size * 0.15,
          },
          line1Style,
        ]}
      />
      <Animated.View
        style={[
          styles.line,
          { 
            width: size, 
            height: size * 0.1, 
            backgroundColor: color,
            marginBottom: size * 0.15,
          },
          line2Style,
        ]}
      />
      <Animated.View
        style={[
          styles.line,
          { 
            width: size, 
            height: size * 0.1, 
            backgroundColor: color,
          },
          line3Style,
        ]}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  line: {
    borderRadius: 2,
  },
});