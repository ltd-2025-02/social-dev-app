import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
  StatusBar,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import PagerView from 'react-native-pager-view';

const { width, height } = Dimensions.get('window');

interface OnboardingScreenProps {
  onFinish: () => void;
}

const onboardingPages = [
  {
    id: 1,
    title: 'Bem-vindo ao SocialDev',
    subtitle: 'A rede social para desenvolvedores',
    description: 'Conecte-se com profissionais de tecnologia, compartilhe conhecimento e construa sua carreira na área de desenvolvimento.',
    icon: 'people',
    gradient: ['#667eea', '#764ba2'],
    backgroundColor: '#667eea',
  },
  {
    id: 2,
    title: 'Feed Inteligente',
    subtitle: 'Conteúdo relevante para você',
    description: 'Descubra posts, artigos e discussões sobre as tecnologias que mais importam para sua carreira. Curta, comente e compartilhe.',
    icon: 'newspaper',
    gradient: ['#f093fb', '#f5576c'],
    backgroundColor: '#f093fb',
  },
  {
    id: 3,
    title: 'Vagas de Emprego',
    subtitle: 'Oportunidades sob medida',
    description: 'Encontre vagas que combinam com seu perfil e habilidades. Aplique diretamente pelo app e acompanhe o status.',
    icon: 'briefcase',
    gradient: ['#4facfe', '#00f2fe'],
    backgroundColor: '#4facfe',
  },
  {
    id: 4,
    title: 'Chat & Networking',
    subtitle: 'Conecte-se com outros devs',
    description: 'Converse com outros desenvolvedores, tire dúvidas, compartilhe experiências e expanda sua rede profissional.',
    icon: 'chatbubbles',
    gradient: ['#43e97b', '#38f9d7'],
    backgroundColor: '#43e97b',
  },
  {
    id: 5,
    title: 'IA Assistant',
    subtitle: 'Seu mentor pessoal',
    description: 'Conte com a ajuda da inteligência artificial para tirar dúvidas, receber dicas de carreira e acelerar seu aprendizado.',
    icon: 'chatbubble-ellipses',
    gradient: ['#fa709a', '#fee140'],
    backgroundColor: '#fa709a',
  },
];

export default function OnboardingScreen({ onFinish }: OnboardingScreenProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const pagerRef = useRef<PagerView>(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const animatePageTransition = () => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0.3,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.sequence([
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const goToNext = () => {
    if (currentPage < onboardingPages.length - 1) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      pagerRef.current?.setPage(nextPage);
      animatePageTransition();
    } else {
      onFinish();
    }
  };

  const goToPrevious = () => {
    if (currentPage > 0) {
      const prevPage = currentPage - 1;
      setCurrentPage(prevPage);
      pagerRef.current?.setPage(prevPage);
      animatePageTransition();
    }
  };

  const skipOnboarding = () => {
    onFinish();
  };

  const currentPageData = onboardingPages[currentPage];

  return (
    <LinearGradient
      colors={currentPageData.gradient}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor={currentPageData.backgroundColor} />
      
      <SafeAreaView style={styles.safeArea}>
        {/* Skip Button */}
        <TouchableOpacity style={styles.skipButton} onPress={skipOnboarding}>
          <Text style={styles.skipText}>Pular</Text>
        </TouchableOpacity>

        {/* Content */}
        <PagerView
          ref={pagerRef}
          style={styles.pagerView}
          initialPage={0}
          onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
        >
          {onboardingPages.map((page) => (
            <View key={page.id} style={styles.page}>
              <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
                <View style={styles.iconContainer}>
                  <View style={styles.iconBackground}>
                    <Ionicons name={page.icon as any} size={60} color="#fff" />
                  </View>
                  <View style={styles.iconGlow} />
                </View>

                <Animated.View 
                  style={[
                    styles.textContainer,
                    {
                      transform: [{
                        translateY: slideAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, -20],
                        }),
                      }],
                    }
                  ]}
                >
                  <Text style={styles.title}>{page.title}</Text>
                  <Text style={styles.subtitle}>{page.subtitle}</Text>
                  <Text style={styles.description}>{page.description}</Text>
                </Animated.View>
              </Animated.View>
            </View>
          ))}
        </PagerView>

        {/* Page Indicators */}
        <View style={styles.indicatorContainer}>
          {onboardingPages.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                index === currentPage && styles.activeIndicator,
              ]}
            />
          ))}
        </View>

        {/* Navigation Buttons */}
        <View style={styles.buttonContainer}>
          {currentPage > 0 && (
            <TouchableOpacity style={styles.previousButton} onPress={goToPrevious}>
              <Ionicons name="chevron-back" size={24} color="#fff" />
              <Text style={styles.buttonText}>Anterior</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.nextButton} onPress={goToNext}>
            <Text style={styles.buttonText}>
              {currentPage === onboardingPages.length - 1 ? 'Começar' : 'Próximo'}
            </Text>
            <Ionicons 
              name={currentPage === onboardingPages.length - 1 ? 'checkmark' : 'chevron-forward'} 
              size={24} 
              color="#fff" 
            />
          </TouchableOpacity>
        </View>

        {/* Gesture Hints */}
        <View style={styles.gestureHints}>
          {currentPage > 0 && (
            <Animated.View style={[styles.gestureHint, styles.leftHint]}>
              <Ionicons name="chevron-back" size={20} color="rgba(255,255,255,0.6)" />
            </Animated.View>
          )}
          {currentPage < onboardingPages.length - 1 && (
            <Animated.View style={[styles.gestureHint, styles.rightHint]}>
              <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.6)" />
            </Animated.View>
          )}
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
  skipButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
  },
  skipText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  pagerView: {
    flex: 1,
  },
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  iconContainer: {
    position: 'relative',
    marginBottom: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBackground: {
    width: 120,
    height: 120,
    borderRadius: 60,
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
    elevation: 12,
  },
  iconGlow: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.1)',
    top: -10,
    left: -10,
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 18,
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
  indicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.4)',
    marginHorizontal: 6,
  },
  activeIndicator: {
    backgroundColor: '#fff',
    width: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingBottom: 40,
  },
  previousButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 25,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 8,
  },
  gestureHints: {
    position: 'absolute',
    bottom: 150,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
  },
  gestureHint: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftHint: {
    alignSelf: 'flex-start',
  },
  rightHint: {
    alignSelf: 'flex-end',
  },
});