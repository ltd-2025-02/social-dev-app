import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { GeminiService } from '../../services/geminiService';

const { width } = Dimensions.get('window');

interface ResumeAnalysisScreenProps {
  navigation: any;
  route: any;
}

interface AnalysisData {
  overallScore: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  skillsAnalysis: {
    technical: { skill: string; level: number; demand: number }[];
    soft: { skill: string; level: number; importance: number }[];
  };
  atsCompatibility: number;
  marketCompatibility: number;
  experienceLevel: 'Junior' | 'Mid' | 'Senior' | 'Lead';
  recommendedJobs: {
    title: string;
    company: string;
    match: number;
    requirements: string[];
  }[];
}

export default function ResumeAnalysisScreen({ navigation, route }: ResumeAnalysisScreenProps) {
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'skills' | 'jobs' | 'interview'>('overview');

  const { resumeFile, mode } = route.params || {};

  useEffect(() => {
    analyzeResume();
  }, []);

  const analyzeResume = async () => {
    setIsLoading(true);
    try {
      // Simulate AI analysis with Gemini
      const prompt = `
      Analise este currículo e forneça uma avaliação completa em formato JSON com:
      - overallScore (0-100)
      - strengths (array de pontos fortes)
      - weaknesses (array de pontos fracos)  
      - suggestions (array de sugestões)
      - skillsAnalysis com technical e soft skills
      - atsCompatibility (0-100)
      - marketCompatibility (0-100)
      - experienceLevel
      - recommendedJobs com vagas compatíveis
      
      ${mode === 'import' ? `Arquivo: ${resumeFile?.name}` : 'Análise de currículo padrão'}
      `;

      // For demo purposes, we'll use mock data
      // In production, you'd process the actual file with Gemini
      const mockAnalysis: AnalysisData = {
        overallScore: 78,
        strengths: [
          'Experiência sólida em desenvolvimento web',
          'Conhecimento em tecnologias modernas',
          'Projetos práticos demonstrados',
          'Formação acadêmica relevante'
        ],
        weaknesses: [
          'Falta de certificações técnicas',
          'Pouca experiência em liderança',
          'Ausência de métricas de impacto',
          'Skills de comunicação não destacadas'
        ],
        suggestions: [
          'Adicionar certificações AWS ou Azure',
          'Incluir métricas quantitativas dos projetos',
          'Destacar soft skills e trabalho em equipe',
          'Atualizar com tecnologias mais recentes'
        ],
        skillsAnalysis: {
          technical: [
            { skill: 'React', level: 85, demand: 95 },
            { skill: 'Node.js', level: 75, demand: 88 },
            { skill: 'TypeScript', level: 70, demand: 92 },
            { skill: 'Python', level: 60, demand: 85 },
            { skill: 'AWS', level: 45, demand: 98 }
          ],
          soft: [
            { skill: 'Comunicação', level: 65, importance: 95 },
            { skill: 'Liderança', level: 40, importance: 85 },
            { skill: 'Resolução de Problemas', level: 80, importance: 90 },
            { skill: 'Trabalho em Equipe', level: 70, importance: 88 }
          ]
        },
        atsCompatibility: 82,
        marketCompatibility: 76,
        experienceLevel: 'Mid',
        recommendedJobs: [
          {
            title: 'Desenvolvedor Full Stack Sr.',
            company: 'TechCorp',
            match: 92,
            requirements: ['React', 'Node.js', '5+ anos exp.']
          },
          {
            title: 'Frontend Developer',
            company: 'StartupXYZ', 
            match: 88,
            requirements: ['React', 'TypeScript', 'Redux']
          },
          {
            title: 'Tech Lead',
            company: 'BigTech Inc.',
            match: 65,
            requirements: ['Liderança', 'Arquitetura', '7+ anos']
          }
        ]
      };

      setTimeout(() => {
        setAnalysisData(mockAnalysis);
        setIsLoading(false);
      }, 2000);

    } catch (error) {
      console.error('Erro na análise:', error);
      setIsLoading(false);
      Alert.alert('Erro', 'Não foi possível analisar o currículo. Tente novamente.');
    }
  };

  const renderProgressBar = (value: number, color: string = '#3b82f6') => (
    <View style={styles.progressBarContainer}>
      <View style={styles.progressBarBg}>
        <View 
          style={[
            styles.progressBarFill, 
            { width: `${value}%`, backgroundColor: color }
          ]} 
        />
      </View>
      <Text style={styles.progressText}>{value}%</Text>
    </View>
  );

  const renderSkillChart = (skills: any[], type: 'technical' | 'soft') => (
    <View style={styles.skillChart}>
      <Text style={styles.chartTitle}>
        {type === 'technical' ? 'Habilidades Técnicas' : 'Soft Skills'}
      </Text>
      {skills.map((skill, index) => (
        <View key={index} style={styles.skillItem}>
          <View style={styles.skillHeader}>
            <Text style={styles.skillName}>{skill.skill}</Text>
            <View style={styles.skillMetrics}>
              <Text style={styles.skillLevel}>Nível: {skill.level}%</Text>
              <Text style={styles.skillDemand}>
                {type === 'technical' ? `Demanda: ${skill.demand}%` : `Import.: ${skill.importance}%`}
              </Text>
            </View>
          </View>
          <View style={styles.skillBars}>
            <View style={styles.skillBar}>
              <View style={[styles.skillBarFill, { width: `${skill.level}%`, backgroundColor: '#3b82f6' }]} />
            </View>
            <View style={styles.skillBar}>
              <View style={[
                styles.skillBarFill, 
                { 
                  width: `${type === 'technical' ? skill.demand : skill.importance}%`, 
                  backgroundColor: '#10b981' 
                }
              ]} />
            </View>
          </View>
        </View>
      ))}
    </View>
  );

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const tabs = [
    { id: 'overview', title: 'Visão Geral', icon: 'analytics-outline' },
    { id: 'skills', title: 'Habilidades', icon: 'code-slash-outline' },
    { id: 'jobs', title: 'Vagas', icon: 'briefcase-outline' },
    { id: 'interview', title: 'Entrevista', icon: 'people-outline' },
  ];

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text style={styles.loadingText}>Analisando seu currículo...</Text>
          <Text style={styles.loadingSubtext}>
            Nossa IA está processando e avaliando cada seção
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!analysisData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color="#ef4444" />
          <Text style={styles.errorText}>Erro na análise</Text>
          <TouchableOpacity style={styles.retryButton} onPress={analyzeResume}>
            <Text style={styles.retryText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#1f2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Análise do Currículo</Text>
        <TouchableOpacity onPress={() => {}}>
          <Ionicons name="download-outline" size={24} color="#1f2937" />
        </TouchableOpacity>
      </View>

      {/* Score Card */}
      <View style={styles.scoreCard}>
        <LinearGradient
          colors={[getScoreColor(analysisData.overallScore), getScoreColor(analysisData.overallScore) + '80']}
          style={styles.scoreGradient}
        >
          <View style={styles.scoreContent}>
            <Text style={styles.scoreLabel}>Score Geral</Text>
            <Text style={styles.scoreValue}>{analysisData.overallScore}/100</Text>
            <Text style={styles.scoreLevel}>Nível: {analysisData.experienceLevel}</Text>
          </View>
          
          <View style={styles.quickMetrics}>
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>{analysisData.atsCompatibility}%</Text>
              <Text style={styles.metricLabel}>ATS</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>{analysisData.marketCompatibility}%</Text>
              <Text style={styles.metricLabel}>Mercado</Text>
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, activeTab === tab.id && styles.activeTab]}
            onPress={() => setActiveTab(tab.id as any)}
          >
            <Ionicons 
              name={tab.icon as any} 
              size={20} 
              color={activeTab === tab.id ? '#3b82f6' : '#6b7280'} 
            />
            <Text style={[
              styles.tabText,
              activeTab === tab.id && styles.activeTabText
            ]}>
              {tab.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'overview' && (
          <View>
            {/* Strengths & Weaknesses */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Pontos Fortes</Text>
              {analysisData.strengths.map((strength, index) => (
                <View key={index} style={styles.listItem}>
                  <Ionicons name="checkmark-circle" size={20} color="#10b981" />
                  <Text style={styles.listText}>{strength}</Text>
                </View>
              ))}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Pontos de Melhoria</Text>
              {analysisData.weaknesses.map((weakness, index) => (
                <View key={index} style={styles.listItem}>
                  <Ionicons name="alert-circle" size={20} color="#f59e0b" />
                  <Text style={styles.listText}>{weakness}</Text>
                </View>
              ))}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Sugestões</Text>
              {analysisData.suggestions.map((suggestion, index) => (
                <View key={index} style={styles.listItem}>
                  <Ionicons name="bulb" size={20} color="#8b5cf6" />
                  <Text style={styles.listText}>{suggestion}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {activeTab === 'skills' && (
          <View>
            {renderSkillChart(analysisData.skillsAnalysis.technical, 'technical')}
            {renderSkillChart(analysisData.skillsAnalysis.soft, 'soft')}
          </View>
        )}

        {activeTab === 'jobs' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Vagas Recomendadas</Text>
            <Text style={styles.sectionSubtitle}>
              Com base no seu perfil, encontramos estas oportunidades
            </Text>
            {analysisData.recommendedJobs.map((job, index) => (
              <View key={index} style={styles.jobCard}>
                <View style={styles.jobHeader}>
                  <View style={styles.jobInfo}>
                    <Text style={styles.jobTitle}>{job.title}</Text>
                    <Text style={styles.jobCompany}>{job.company}</Text>
                  </View>
                  <View style={styles.matchBadge}>
                    <Text style={styles.matchText}>{job.match}%</Text>
                  </View>
                </View>
                <View style={styles.jobRequirements}>
                  <Text style={styles.requirementsTitle}>Requisitos:</Text>
                  <View style={styles.requirementsList}>
                    {job.requirements.map((req, idx) => (
                      <View key={idx} style={styles.requirementTag}>
                        <Text style={styles.requirementText}>{req}</Text>
                      </View>
                    ))}
                  </View>
                </View>
                <TouchableOpacity style={styles.applyButton}>
                  <Text style={styles.applyButtonText}>Ver Detalhes</Text>
                  <Ionicons name="arrow-forward" size={16} color="#3b82f6" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {activeTab === 'interview' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Preparação para Entrevistas</Text>
            <Text style={styles.sectionSubtitle}>
              Pratique e aprimore suas habilidades de entrevista
            </Text>
            
            <TouchableOpacity 
              style={styles.interviewCard}
              onPress={() => navigation.navigate('InterviewSimulator', { 
                level: analysisData.experienceLevel,
                skills: analysisData.skillsAnalysis.technical 
              })}
            >
              <LinearGradient
                colors={['#8b5cf6', '#3b82f6']}
                style={styles.interviewGradient}
              >
                <Ionicons name="people" size={32} color="#fff" />
                <View style={styles.interviewInfo}>
                  <Text style={styles.interviewTitle}>Simulador de Entrevista</Text>
                  <Text style={styles.interviewSubtitle}>
                    Pratique com nossa IA especializada
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={24} color="rgba(255,255,255,0.8)" />
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.interviewTips}>
              <Text style={styles.tipsTitle}>Dicas Personalizadas</Text>
              <View style={styles.tipItem}>
                <Ionicons name="star" size={16} color="#f59e0b" />
                <Text style={styles.tipText}>
                  Prepare exemplos específicos dos projetos mencionados no seu currículo
                </Text>
              </View>
              <View style={styles.tipItem}>
                <Ionicons name="star" size={16} color="#f59e0b" />
                <Text style={styles.tipText}>
                  Estude sobre as tecnologias que você listou como conhecimento
                </Text>
              </View>
              <View style={styles.tipItem}>
                <Ionicons name="star" size={16} color="#f59e0b" />
                <Text style={styles.tipText}>
                  Pratique explicar conceitos técnicos de forma simples
                </Text>
              </View>
            </View>
          </View>
        )}
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginTop: 16,
  },
  loadingSubtext: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 8,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ef4444',
    marginTop: 16,
  },
  retryButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  retryText: {
    color: '#fff',
    fontWeight: '600',
  },
  scoreCard: {
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  scoreGradient: {
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  scoreContent: {
    alignItems: 'center',
  },
  scoreLabel: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.9,
  },
  scoreValue: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
    marginVertical: 4,
  },
  scoreLevel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  quickMetrics: {
    flexDirection: 'row',
    gap: 24,
  },
  metricItem: {
    alignItems: 'center',
  },
  metricValue: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  metricLabel: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.8,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    gap: 4,
  },
  activeTab: {
    backgroundColor: '#f1f5f9',
  },
  tabText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#3b82f6',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 12,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 12,
  },
  listText: {
    flex: 1,
    fontSize: 15,
    color: '#374151',
    lineHeight: 22,
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressBarBg: {
    flex: 1,
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '600',
  },
  skillChart: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 12,
    padding: 20,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  skillItem: {
    marginBottom: 20,
  },
  skillHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  skillName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
  },
  skillMetrics: {
    alignItems: 'flex-end',
  },
  skillLevel: {
    fontSize: 12,
    color: '#3b82f6',
    fontWeight: '600',
  },
  skillDemand: {
    fontSize: 12,
    color: '#10b981',
    fontWeight: '600',
  },
  skillBars: {
    gap: 4,
  },
  skillBar: {
    height: 6,
    backgroundColor: '#f3f4f6',
    borderRadius: 3,
  },
  skillBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  jobCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  jobInfo: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  jobCompany: {
    fontSize: 14,
    color: '#6b7280',
  },
  matchBadge: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  matchText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  jobRequirements: {
    marginBottom: 16,
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  requirementsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  requirementTag: {
    backgroundColor: '#e5e7eb',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  requirementText: {
    fontSize: 12,
    color: '#6b7280',
  },
  applyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
  },
  applyButtonText: {
    color: '#3b82f6',
    fontWeight: '600',
  },
  interviewCard: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  interviewGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    gap: 16,
  },
  interviewInfo: {
    flex: 1,
  },
  interviewTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  interviewSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
  },
  interviewTips: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 8,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
});