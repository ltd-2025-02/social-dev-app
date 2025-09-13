import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import UniversalHeader from '../../components/UniversalHeader';
import { useTheme } from '../../contexts/ThemeContext';

export default function AIAssistantInfoScreen({ navigation }: any) {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <UniversalHeader title="Bem-vindo ao IA Assistant" showBackButton={true} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Ionicons name="sparkles" size={80} color={colors.primary} style={styles.icon} />
          <Text style={[styles.title, { color: colors.text }]}>Seu Guia Pessoal de IA</Text>
          <Text style={[styles.description, { color: colors.textMuted }]}>
            O IA Assistant é uma ferramenta poderosa para te ajudar em sua jornada de desenvolvimento.
            Ele pode gerar código, explicar conceitos complexos, sugerir soluções para problemas
            e muito mais. Personalize-o para atender às suas necessidades!
          </Text>

          <View style={styles.featureList}>
            <View style={styles.featureItem}>
              <Ionicons name="code-slash-outline" size={24} color={colors.primary} />
              <Text style={[styles.featureText, { color: colors.text }]}>Geração de Código</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="bulb-outline" size={24} color={colors.primary} />
              <Text style={[styles.featureText, { color: colors.text }]}>Explicação de Conceitos</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="chatbubbles-outline" size={24} color={colors.primary} />
              <Text style={[styles.featureText, { color: colors.text }]}>Assistência em Tempo Real</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="settings-outline" size={24} color={colors.primary} />
              <Text style={[styles.featureText, { color: colors.text }]}>Configurações Personalizáveis</Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.primary }]}
            onPress={() => navigation.navigate('AIAssistantConfig')}
          >
            <Text style={styles.buttonText}>Configurar IA Assistant</Text>
            <Ionicons name="arrow-forward" size={20} color={colors.buttonText} style={styles.buttonIcon} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    alignItems: 'center',
    maxWidth: 600,
    width: '100%',
  },
  icon: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  featureList: {
    width: '100%',
    marginBottom: 40,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingHorizontal: 10,
  },
  featureText: {
    fontSize: 16,
    marginLeft: 15,
    fontWeight: '500',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 20,
    width: '100%',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginRight: 10,
  },
  buttonIcon: {
    marginLeft: 5,
  },
});
