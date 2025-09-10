import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function AboutScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#1f2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sobre</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        {/* Logo Section */}
        <View style={styles.logoSection}>
          <LinearGradient
            colors={['#3b82f6', '#1d4ed8']}
            style={styles.logoContainer}
          >
            <Ionicons name="people" size={48} color="#fff" />
          </LinearGradient>
          <Text style={styles.appName}>SocialDev</Text>
          <Text style={styles.appTagline}>Conectando desenvolvedores</Text>
          <Text style={styles.version}>Versão 1.0.0</Text>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nossa Missão</Text>
          <Text style={styles.aboutText}>
            O SocialDev foi criado para conectar desenvolvedores de todo o mundo, 
            oferecendo uma plataforma onde profissionais de tecnologia podem 
            compartilhar conhecimento, encontrar oportunidades de carreira e 
            construir uma rede profissional sólida.
          </Text>
        </View>

        {/* Features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recursos</Text>
          {[
            { icon: 'newspaper-outline', title: 'Feed Social', desc: 'Compartilhe e descubra conteúdo' },
            { icon: 'briefcase-outline', title: 'Vagas', desc: 'Encontre oportunidades de emprego' },
            { icon: 'chatbubbles-outline', title: 'Chat', desc: 'Conecte-se com outros devs' },
            { icon: 'person-outline', title: 'Perfil', desc: 'Mostre suas habilidades' },
            { icon: 'chatbubble-ellipses-outline', title: 'IA Assistant', desc: 'Seu guia pessoal' },
          ].map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <Ionicons name={feature.icon as any} size={24} color="#3b82f6" />
              <View style={styles.featureInfo}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDesc}>{feature.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Contact */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contato</Text>
          <Text style={styles.contactText}>📧 contato@socialdev.com</Text>
          <Text style={styles.contactText}>🌐 www.socialdev.com</Text>
          <Text style={styles.contactText}>📱 @socialdev_app</Text>
        </View>

        {/* Legal */}
        <View style={styles.legalSection}>
          <TouchableOpacity style={styles.legalItem}>
            <Text style={styles.legalText}>Termos de Uso</Text>
            <Ionicons name="chevron-forward" size={16} color="#6b7280" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.legalItem}>
            <Text style={styles.legalText}>Política de Privacidade</Text>
            <Ionicons name="chevron-forward" size={16} color="#6b7280" />
          </TouchableOpacity>
        </View>

        <Text style={styles.copyright}>
          © 2024 SocialDev. Todos os direitos reservados.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    textAlign: 'center',
  },
  content: { flex: 1 },
  logoSection: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 16,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  appTagline: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  version: {
    fontSize: 12,
    color: '#9ca3af',
  },
  section: {
    backgroundColor: '#fff',
    margin: 16,
    marginTop: 0,
    borderRadius: 16,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  aboutText: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureInfo: {
    marginLeft: 12,
    flex: 1,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  featureDesc: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  contactText: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 8,
  },
  legalSection: {
    backgroundColor: '#fff',
    margin: 16,
    marginTop: 0,
    borderRadius: 16,
    overflow: 'hidden',
  },
  legalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  legalText: {
    fontSize: 14,
    color: '#4b5563',
  },
  copyright: {
    textAlign: 'center',
    fontSize: 12,
    color: '#9ca3af',
    padding: 20,
  },
});