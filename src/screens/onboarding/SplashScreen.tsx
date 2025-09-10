import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  onGetStarted: () => void;
}

export default function SplashScreen({ onGetStarted }: SplashScreenProps) {
  const logoAnim = useRef(new Animated.Value(0)).current;
  const textAnim = useRef(new Animated.Value(0)).current;
  const buttonAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animateEntrance = () => {
      // Logo animation
      Animated.sequence([
        Animated.spring(logoAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          delay: 500,
          useNativeDriver: true,
        }),
      ]).start();

      // Text animation
      Animated.sequence([
        Animated.timing(textAnim, {
          toValue: 1,
          duration: 800,
          delay: 1000,
          useNativeDriver: true,
        }),
      ]).start();

      // Button animation
      Animated.sequence([
        Animated.spring(buttonAnim, {
          toValue: 1,
          tension: 120,
          friction: 8,
          delay: 1500,
          useNativeDriver: true,
        }),
      ]).start();
    };

    const startPulseAnimation = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    animateEntrance();
    setTimeout(startPulseAnimation, 2000);
  }, []);

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2', '#667eea']}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor="#667eea" />
      
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          {/* Background Decorations */}
          <View style={styles.decorationContainer}>
            <Animated.View 
              style={[
                styles.decoration,
                styles.decoration1,
                {
                  transform: [{ scale: pulseAnim }],
                  opacity: pulseAnim.interpolate({
                    inputRange: [1, 1.1],
                    outputRange: [0.1, 0.2],
                  }),
                }
              ]}
            />
            <Animated.View 
              style={[
                styles.decoration,
                styles.decoration2,
                {
                  transform: [{ 
                    scale: pulseAnim.interpolate({
                      inputRange: [1, 1.1],
                      outputRange: [1, 0.9],
                    })
                  }],
                  opacity: 0.1,
                }
              ]}
            />
            <Animated.View 
              style={[
                styles.decoration,
                styles.decoration3,
                {
                  transform: [{ 
                    scale: pulseAnim.interpolate({
                      inputRange: [1, 1.1],
                      outputRange: [0.8, 1],
                    })
                  }],
                  opacity: 0.05,
                }
              ]}
            />
          </View>

          {/* Logo Section */}
          <Animated.View 
            style={[
              styles.logoContainer,
              {
                opacity: logoAnim,
                transform: [
                  {
                    scale: logoAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.3, 1],
                    }),
                  },
                  {
                    rotate: logoAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '360deg'],
                    }),
                  },
                ],
              },
            ]}
          >
            <View style={styles.logoBackground}>
              <Ionicons name="people" size={80} color="#fff" />
            </View>
            <View style={styles.logoGlow} />
          </Animated.View>

          {/* Text Section */}
          <Animated.View 
            style={[
              styles.textContainer,
              {
                opacity: textAnim,
                transform: [
                  {
                    translateY: textAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [50, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <Text style={styles.title}>SocialDev</Text>
            <Text style={styles.subtitle}>Conectando desenvolvedores</Text>
            <Text style={styles.description}>
              A rede social feita por devs, para devs. 
              Conecte-se, aprenda e cresça profissionalmente.
            </Text>
          </Animated.View>

          {/* Button Section */}
          <Animated.View 
            style={[
              styles.buttonContainer,
              {
                opacity: buttonAnim,
                transform: [
                  {
                    scale: buttonAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.8, 1],
                    }),
                  },
                ],
              },
            ]}
          >
            <TouchableOpacity style={styles.getStartedButton} onPress={onGetStarted}>
              <Text style={styles.buttonText}>Começar</Text>
              <Ionicons name="arrow-forward" size={24} color="#667eea" />
            </TouchableOpacity>
            
            <Text style={styles.swipeHint}>
              Deslize para conhecer o app →
            </Text>
          </Animated.View>

          {/* Features Preview */}
          <Animated.View 
            style={[
              styles.featuresPreview,
              {
                opacity: buttonAnim,
                transform: [
                  {
                    translateY: buttonAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [30, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <View style={styles.featureIcon}>
              <Ionicons name="newspaper-outline" size={20} color="rgba(255,255,255,0.8)" />
            </View>
            <View style={styles.featureIcon}>
              <Ionicons name="briefcase-outline" size={20} color="rgba(255,255,255,0.8)" />
            </View>
            <View style={styles.featureIcon}>
              <Ionicons name="chatbubbles-outline" size={20} color="rgba(255,255,255,0.8)" />
            </View>
            <View style={styles.featureIcon}>
              <Ionicons name="person-outline" size={20} color="rgba(255,255,255,0.8)" />
            </View>
            <View style={styles.featureIcon}>
              <Ionicons name="chatbubble-ellipses-outline" size={20} color="rgba(255,255,255,0.8)" />
            </View>
          </Animated.View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  decorationContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  decoration: {
    position: 'absolute',
    borderRadius: 200,
    backgroundColor: '#fff',
  },
  decoration1: {
    width: 300,
    height: 300,
    top: -100,
    left: -100,
  },
  decoration2: {
    width: 200,
    height: 200,
    bottom: -50,
    right: -75,
  },
  decoration3: {
    width: 150,
    height: 150,
    top: 200,
    right: -50,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 60,
    position: 'relative',
  },
  logoBackground: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
  },
  logoGlow: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.1)',
    top: -20,
    left: -20,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 80,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 12,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 20,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: '600',
  },
  description: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    alignItems: 'center',
    width: '100%',
  },
  getStartedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#667eea',
    marginRight: 12,
  },
  swipeHint: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  featuresPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 40,
    gap: 16,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});