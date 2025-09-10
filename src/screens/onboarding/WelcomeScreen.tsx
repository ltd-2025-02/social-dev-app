import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';

const { width, height } = Dimensions.get('window');

interface WelcomeScreenProps {
  navigation: any;
  onComplete?: () => void;
}

interface OnboardingSlide {
  id: number;
  title: string;
  description: string;
  icon: string;
  color: string;
  backgroundColor: string;
}

const onboardingData: OnboardingSlide[] = [
  {
    id: 1,
    title: 'Bem-vindo ao SocialDev! 👋',
    description: 'A rede social feita especialmente para desenvolvedores se conectarem, compartilharem conhecimento e crescerem juntos.',
    icon: 'code-slash',
    color: '#3b82f6',
    backgroundColor: '#eff6ff',
  },
  {
    id: 2,
    title: 'Conecte-se com Devs 🤝',
    description: 'Encontre outros desenvolvedores, siga pessoas inspiradoras e construa sua rede profissional na área tech.',
    icon: 'people',
    color: '#10b981',
    backgroundColor: '#f0fdf4',
  },
  {
    id: 3,
    title: 'Compartilhe Conhecimento 📝',
    description: 'Publique seus projetos, compartilhe dicas, faça perguntas e ajude outros desenvolvedores com suas experiências.',
    icon: 'bulb',
    color: '#f59e0b',
    backgroundColor: '#fffbeb',
  },
  {
    id: 4,
    title: 'Chat em Tempo Real 💬',
    description: 'Converse diretamente com seus contatos, tire dúvidas e colabore em projetos através do nosso sistema de mensagens.',
    icon: 'chatbubbles',
    color: '#8b5cf6',
    backgroundColor: '#faf5ff',
  },
  {
    id: 5,
    title: 'Encontre Oportunidades 🚀',
    description: 'Descubra vagas de emprego na área de tecnologia e oportunidades que combinam com seu perfil e habilidades.',
    icon: 'briefcase',
    color: '#ef4444',
    backgroundColor: '#fef2f2',
  },
  {
    id: 6,
    title: 'Personalize seu Perfil 🎨',
    description: 'Escolha uma persona animal, adicione suas skills, experiências e mostre quem você é no mundo da programação!',
    icon: 'person-circle',
    color: '#06b6d4',
    backgroundColor: '#f0fdff',
  },
];

export default function WelcomeScreen({ navigation, onComplete }: WelcomeScreenProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const dispatch = useDispatch();

  const handleNext = () => {
    if (currentSlide < onboardingData.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      handleFinish();
    }
  };

  const handlePrevious = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleSkip = () => {
    setCurrentSlide(onboardingData.length - 1);
  };

  const handleFinish = async () => {
    try {
      // Marcar onboarding como concluído
      await AsyncStorage.setItem('onboarding_completed', 'true');
      
      // Se há callback, usar ele, senão navegar normalmente
      if (onComplete) {
        onComplete();
      } else {
        // Navegar para a tela principal
        navigation.reset({
          index: 0,
          routes: [{ name: 'Main' }],
        });
      }
    } catch (error) {
      console.error('Error completing onboarding:', error);
      // Mesmo com erro, finalizar processo
      if (onComplete) {
        onComplete();
      } else {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Main' }],
        });
      }
    }
  };

  const handleDotPress = (index: number) => {
    setCurrentSlide(index);
  };

  const renderSlide = (slide: OnboardingSlide) => (
    <ScrollView 
      style={styles.slideContainer}
      contentContainerStyle={styles.slideContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Icon */}
      <View style={[styles.iconContainer, { backgroundColor: slide.backgroundColor }]}>
        <Ionicons name={slide.icon as any} size={80} color={slide.color} />
      </View>

      {/* Content */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>{slide.title}</Text>
        <Text style={styles.description}>{slide.description}</Text>
      </View>

      {/* Features list for some slides */}
      {slide.id === 2 && (
        <View style={styles.featuresList}>
          <FeatureItem icon="search" text="Buscar desenvolvedores por tecnologia" />
          <FeatureItem icon="add-circle" text="Seguir e ser seguido" />
          <FeatureItem icon="notifications" text="Receber notificações de atividades" />
        </View>
      )}

      {slide.id === 3 && (
        <View style={styles.featuresList}>
          <FeatureItem icon="create" text="Publicar posts com código e imagens" />
          <FeatureItem icon="heart" text="Curtir e comentar posts" />
          <FeatureItem icon="share" text="Compartilhar conhecimento" />
        </View>
      )}

      {slide.id === 5 && (
        <View style={styles.featuresList}>
          <FeatureItem icon="location" text="Vagas próximas à sua localização" />
          <FeatureItem icon="filter" text="Filtrar por tecnologia e nível" />
          <FeatureItem icon="bookmark" text="Salvar vagas interessantes" />
        </View>
      )}
    </ScrollView>
  );

  const FeatureItem = ({ icon, text }: { icon: string; text: string }) => (
    <View style={styles.featureItem}>
      <Ionicons name={icon as any} size={20} color="#10b981" />
      <Text style={styles.featureText}>{text}</Text>
    </View>
  );

  const isLastSlide = currentSlide === onboardingData.length - 1;
  const isFirstSlide = currentSlide === 0;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.stepCounter}>
          {currentSlide + 1} de {onboardingData.length}
        </Text>
        
        {!isLastSlide && (
          <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
            <Text style={styles.skipText}>Pular</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Content */}
      <View style={styles.content}>
        {renderSlide(onboardingData[currentSlide])}
      </View>

      {/* Pagination Dots */}
      <View style={styles.pagination}>
        {onboardingData.map((_, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.dot,
              {
                backgroundColor: index === currentSlide ? '#3b82f6' : '#e5e7eb',
                width: index === currentSlide ? 24 : 8,
              }
            ]}
            onPress={() => handleDotPress(index)}
          />
        ))}
      </View>

      {/* Navigation */}
      <View style={styles.navigation}>
        <TouchableOpacity
          onPress={handlePrevious}
          style={[styles.navButton, styles.backButton, isFirstSlide && styles.navButtonDisabled]}
          disabled={isFirstSlide}
        >
          <Ionicons 
            name="chevron-back" 
            size={24} 
            color={isFirstSlide ? '#9ca3af' : '#3b82f6'} 
          />
          <Text style={[styles.navButtonText, isFirstSlide && styles.navButtonTextDisabled]}>
            Anterior
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleNext}
          style={[styles.navButton, styles.nextButton]}
        >
          <Text style={styles.nextButtonText}>
            {isLastSlide ? 'Começar!' : 'Próximo'}
          </Text>
          <Ionicons 
            name={isLastSlide ? 'checkmark' : 'chevron-forward'} 
            size={24} 
            color="white" 
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  stepCounter: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  skipButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  skipText: {
    fontSize: 16,
    color: '#3b82f6',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  slideContainer: {
    flex: 1,
  },
  slideContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    minHeight: height * 0.6,
  },
  iconContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 34,
  },
  description: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  featuresList: {
    width: '100%',
    gap: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  featureText: {
    fontSize: 14,
    color: '#4b5563',
    marginLeft: 12,
    flex: 1,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    transition: 'all 0.3s ease',
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 16,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    minWidth: 100,
  },
  backButton: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  nextButton: {
    backgroundColor: '#3b82f6',
    flex: 1,
    justifyContent: 'center',
    maxWidth: 200,
  },
  navButtonDisabled: {
    backgroundColor: '#f3f4f6',
    borderColor: '#d1d5db',
  },
  navButtonText: {
    fontSize: 16,
    color: '#3b82f6',
    fontWeight: '600',
    marginRight: 4,
  },
  navButtonTextDisabled: {
    color: '#9ca3af',
  },
  nextButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
    marginRight: 8,
    textAlign: 'center',
  },
});