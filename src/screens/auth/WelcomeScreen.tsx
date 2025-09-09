
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/AuthNavigator';

// Props type removed for JavaScript compatibility

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen({ navigation }) {
  return (
    <LinearGradient
      colors={['#2563eb', '#7c3aed', '#059669']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Ionicons name="code-slash" size={80} color="white" />
          <Text style={styles.logoText}>SocialDev</Text>
          <Text style={styles.tagline}>A rede social dos desenvolvedores</Text>
        </View>

        {/* Features */}
        <View style={styles.featuresContainer}>
          <View style={styles.feature}>
            <Ionicons name="people" size={32} color="white" />
            <Text style={styles.featureTitle}>Conecte-se</Text>
            <Text style={styles.featureText}>
              Encontre desenvolvedores com interesses similares
            </Text>
          </View>

          <View style={styles.feature}>
            <Ionicons name="rocket" size={32} color="white" />
            <Text style={styles.featureTitle}>Compartilhe</Text>
            <Text style={styles.featureText}>
              Mostre seus projetos e colabore em outros
            </Text>
          </View>

          <View style={styles.feature}>
            <Ionicons name="briefcase" size={32} color="white" />
            <Text style={styles.featureTitle}>Trabalhe</Text>
            <Text style={styles.featureText}>
              Encontre oportunidades de carreira incríveis
            </Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>10K+</Text>
            <Text style={styles.statLabel}>Desenvolvedores</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>2.5K+</Text>
            <Text style={styles.statLabel}>Projetos</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>50+</Text>
            <Text style={styles.statLabel}>Linguagens</Text>
          </View>
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.primaryButtonText}>Criar Conta Grátis</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.secondaryButtonText}>Já tenho conta</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.disclaimer}>
          Grátis para sempre • Sem spam • Open Source
        </Text>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    paddingTop: Math.max(60, height * 0.08),
    paddingBottom: 40,
    justifyContent: height < 700 ? 'flex-start' : 'center',
    minHeight: height,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: height < 700 ? 24 : 32,
  },
  logoText: {
    fontSize: Math.min(48, width * 0.12),
    fontWeight: 'bold',
    color: 'white',
    marginTop: 16,
  },
  tagline: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 8,
    textAlign: 'center',
  },
  featuresContainer: {
    marginBottom: height < 700 ? 24 : 32,
  },
  feature: {
    alignItems: 'center',
    marginBottom: height < 700 ? 16 : 24,
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 12,
    marginBottom: 4,
  },
  featureText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: height < 700 ? 24 : 32,
    paddingHorizontal: 24,
  },
  stat: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  statLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 4,
  },
  buttonContainer: {
    marginBottom: 24,
  },
  button: {
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  primaryButton: {
    backgroundColor: 'white',
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  secondaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  disclaimer: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 18,
  },
});
