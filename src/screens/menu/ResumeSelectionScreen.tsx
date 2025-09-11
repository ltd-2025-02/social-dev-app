import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as DocumentPicker from 'expo-document-picker';

interface ResumeSelectionScreenProps {
  navigation: any;
}

export default function ResumeSelectionScreen({ navigation }: ResumeSelectionScreenProps) {
  const handleImportResume = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        navigation.navigate('ResumeAnalysis', { 
          resumeFile: result.assets[0],
          mode: 'import'
        });
      }
    } catch (error) {
      console.error('Erro ao importar currículo:', error);
    }
  };

  const handleCreateNew = () => {
    navigation.navigate('ResumeBuilder', { mode: 'create' });
  };

  const handleAnalyzeExisting = () => {
    navigation.navigate('ResumeAnalysis', { mode: 'analyze' });
  };

  const options = [
    {
      id: 'import',
      title: 'Importar Currículo',
      subtitle: 'Analise e melhore um currículo existente',
      description: 'Envie seu currículo em PDF ou Word para que nossa IA analise e sugira melhorias',
      icon: 'cloud-upload-outline',
      color: ['#3b82f6', '#1d4ed8'],
      action: handleImportResume,
      features: [
        'Análise automática com IA',
        'Sugestões de melhorias',
        'Compatibilidade de vagas',
        'Gráficos de análise'
      ]
    },
    {
      id: 'create',
      title: 'Criar do Zero',
      subtitle: 'Assistente guiado passo a passo',
      description: 'Crie um currículo profissional com nossa IA conversacional especializada',
      icon: 'document-text-outline',
      color: ['#10b981', '#059669'],
      action: handleCreateNew,
      features: [
        'Chat inteligente com IA',
        'Templates profissionais',
        'Otimização automática',
        'Export PDF/DOC'
      ]
    },
    {
      id: 'analyze',
      title: 'Analisar Currículo',
      subtitle: 'Dashboard completo de análise',
      description: 'Veja métricas detalhadas e recomendações para seu currículo atual',
      icon: 'analytics-outline',
      color: ['#8b5cf6', '#7c3aed'],
      action: handleAnalyzeExisting,
      features: [
        'Gráficos e métricas',
        'Score de compatibilidade',
        'Recomendações de vagas',
        'Preparação para entrevistas'
      ]
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#1f2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Assistente de Currículo</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <View style={styles.welcomeIcon}>
            <LinearGradient
              colors={['#3b82f6', '#8b5cf6']}
              style={styles.iconGradient}
            >
              <Ionicons name="briefcase" size={32} color="#fff" />
            </LinearGradient>
          </View>
          <Text style={styles.welcomeTitle}>Como posso te ajudar hoje?</Text>
          <Text style={styles.welcomeSubtitle}>
            Escolha a opção que melhor atende às suas necessidades profissionais
          </Text>
        </View>

        {/* Options */}
        <View style={styles.optionsContainer}>
          {options.map((option, index) => (
            <TouchableOpacity
              key={option.id}
              style={[styles.optionCard, { marginBottom: index === options.length - 1 ? 24 : 16 }]}
              onPress={option.action}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={option.color}
                style={styles.optionGradient}
              >
                <View style={styles.optionHeader}>
                  <View style={styles.optionIconContainer}>
                    <Ionicons name={option.icon as any} size={28} color="#fff" />
                  </View>
                  <View style={styles.optionInfo}>
                    <Text style={styles.optionTitle}>{option.title}</Text>
                    <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={24} color="rgba(255,255,255,0.8)" />
                </View>
              </LinearGradient>
              
              <View style={styles.optionContent}>
                <Text style={styles.optionDescription}>
                  {option.description}
                </Text>
                
                <View style={styles.featuresContainer}>
                  <Text style={styles.featuresTitle}>Recursos inclusos:</Text>
                  <View style={styles.featuresList}>
                    {option.features.map((feature, idx) => (
                      <View key={idx} style={styles.featureItem}>
                        <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                        <Text style={styles.featureText}>{feature}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <Text style={styles.statsTitle}>Por que usar nosso assistente?</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>98%</Text>
              <Text style={styles.statLabel}>Taxa de aprovação</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>2.5x</Text>
              <Text style={styles.statLabel}>Mais entrevistas</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>48h</Text>
              <Text style={styles.statLabel}>Tempo médio de resposta</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>10k+</Text>
              <Text style={styles.statLabel}>Currículos criados</Text>
            </View>
          </View>
        </View>

        {/* Tips Section */}
        <View style={styles.tipsSection}>
          <View style={styles.tipHeader}>
            <Ionicons name="bulb" size={24} color="#f59e0b" />
            <Text style={styles.tipTitle}>Dica Profissional</Text>
          </View>
          <Text style={styles.tipText}>
            Currículos otimizados por IA têm 3x mais chances de passar pelos sistemas ATS (Applicant Tracking System) das empresas.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  welcomeSection: {
    backgroundColor: '#fff',
    margin: 16,
    marginBottom: 0,
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
  },
  welcomeIcon: {
    marginBottom: 20,
  },
  iconGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  optionsContainer: {
    margin: 16,
  },
  optionCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  optionGradient: {
    padding: 20,
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  optionInfo: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  optionSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  optionContent: {
    padding: 20,
  },
  optionDescription: {
    fontSize: 15,
    color: '#4b5563',
    lineHeight: 22,
    marginBottom: 16,
  },
  featuresContainer: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
  },
  featuresTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  featuresList: {
    gap: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureText: {
    fontSize: 13,
    color: '#6b7280',
    marginLeft: 8,
    flex: 1,
  },
  statsSection: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 16,
    padding: 24,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 16,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3b82f6',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  tipsSection: {
    backgroundColor: '#fffbeb',
    margin: 16,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#fed7aa',
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#92400e',
    marginLeft: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#78350f',
    lineHeight: 20,
  },
});