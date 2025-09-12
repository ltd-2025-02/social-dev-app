import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../contexts/ThemeContext';
import UniversalHeader from '../../components/UniversalHeader';
import { CareerPath, UserCareerProfile, CareerAnalytics } from '../../types/career.types';
import { CareerService } from '../../services/career.service';

const { width } = Dimensions.get('window');

interface CareerPathDetailScreenProps {
  navigation: any;
  route: {
    params: {
      pathId: string;
    };
  };
}

export default function CareerPathDetailScreen({ navigation, route }: CareerPathDetailScreenProps) {
  const { colors } = useTheme();
  const { pathId } = route.params;
  const [careerPath, setCareerPath] = useState<CareerPath | null>(null);
  const [analytics, setAnalytics] = useState<CareerAnalytics | null>(null);
  const [userProfile, setUserProfile] = useState<UserCareerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'roadmap' | 'skills' | 'analytics'>('overview');

  const careerService = new CareerService();

  useEffect(() => {
    loadCareerPathData();
  }, [pathId]);

  const loadCareerPathData = async () => {
    try {
      setLoading(true);
      const [pathData, analyticsData, profileData] = await Promise.all([
        careerService.getCareerPath(pathId),
        careerService.getUserCareerAnalytics('user-id'), // Replace with actual user ID
        careerService.getUserCareerProfile('user-id')
      ]);
      
      setCareerPath(pathData);
      setAnalytics(analyticsData);
      setUserProfile(profileData);
    } catch (error) {
      console.error('Error loading career path:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados da trilha de carreira');
    } finally {
      setLoading(false);
    }
  };

  const handleStartPath = async () => {
    if (!careerPath) return;
    
    try {
      await careerService.updateUserCareerProfile('user-id', {
        targetPath: careerPath.id,
        goals: [
          {
            id: '',
            type: 'role',
            title: `Tornar-se ${careerPath.title}`,
            description: careerPath.description,
            target: careerPath.title,
            deadline: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
            priority: 'high',
            progress: 0,
            milestones: [],
            completed: false,
            createdAt: new Date()
          }
        ],
        preferences: {
          preferredLocations: [],
          remoteWorkPreference: careerPath.workStyle as any,
          companySizePreference: 'no-preference',
          industryPreferences: [],
          salaryExpectation: {
            min: careerPath.averageSalary.min,
            max: careerPath.averageSalary.max,
            currency: careerPath.averageSalary.currency
          },
          benefitsPreferences: [],
          learningStyle: 'mixed',
          timeAvailability: 10
        }
      });
      
      Alert.alert('Sucesso', 'Trilha de carreira iniciada com sucesso!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível iniciar a trilha de carreira');
    }
  };

  const renderProgressChart = () => {
    if (!analytics || !careerPath) return null;

    const skillProgress = careerPath.requiredSkills.map(skill => {
      const userSkill = analytics.skillGrowth.find(s => s.skillId === skill.skillId);
      return {
        name: skill.skillId,
        progress: userSkill ? (userSkill.history[userSkill.history.length - 1]?.level || 0) * 25 : 0,
        required: skill.level
      };
    });

    return (
      <View style={styles.chartContainer}>
        <Text style={[styles.chartTitle, { color: colors.text }]}>Progresso das Habilidades</Text>
        {skillProgress.map((skill, index) => (
          <View key={index} style={styles.skillProgressItem}>
            <Text style={[styles.skillName, { color: colors.text }]}>{skill.name}</Text>
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBarBackground}>
                <View 
                  style={[
                    styles.progressBarFill,
                    { 
                      width: `${skill.progress}%`,
                      backgroundColor: colors.primary 
                    }
                  ]} 
                />
              </View>
              <Text style={[styles.progressText, { color: colors.textMuted }]}>
                {skill.progress.toFixed(0)}%
              </Text>
            </View>
          </View>
        ))}
      </View>
    );
  };

  const renderSalaryProjection = () => {
    if (!analytics || !careerPath) return null;

    return (
      <View style={styles.salaryContainer}>
        <Text style={[styles.chartTitle, { color: colors.text }]}>Projeção Salarial</Text>
        <View style={styles.salaryGrid}>
          <View style={styles.salaryItem}>
            <Text style={[styles.salaryLabel, { color: colors.textMuted }]}>Atual</Text>
            <Text style={[styles.salaryValue, { color: colors.text }]}>
              R$ {analytics.salaryProgression.currentSalaryRange.min.toLocaleString()}
            </Text>
          </View>
          <View style={styles.salaryItem}>
            <Text style={[styles.salaryLabel, { color: colors.textMuted }]}>1 Ano</Text>
            <Text style={[styles.salaryValue, { color: colors.success }]}>
              R$ {analytics.salaryProgression.projectedSalary.oneYear.toLocaleString()}
            </Text>
          </View>
          <View style={styles.salaryItem}>
            <Text style={[styles.salaryLabel, { color: colors.textMuted }]}>3 Anos</Text>
            <Text style={[styles.salaryValue, { color: colors.success }]}>
              R$ {analytics.salaryProgression.projectedSalary.threeYears.toLocaleString()}
            </Text>
          </View>
          <View style={styles.salaryItem}>
            <Text style={[styles.salaryLabel, { color: colors.textMuted }]}>5 Anos</Text>
            <Text style={[styles.salaryValue, { color: colors.success }]}>
              R$ {analytics.salaryProgression.projectedSalary.fiveYears.toLocaleString()}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderOverview = () => {
    if (!careerPath) return null;

    return (
      <View style={styles.tabContent}>
        {/* Hero Section */}
        <LinearGradient
          colors={careerPath.color}
          style={styles.heroSection}
        >
          <View style={styles.heroIcon}>
            <Ionicons name={careerPath.icon as any} size={32} color="#fff" />
          </View>
          <Text style={styles.heroTitle}>{careerPath.title}</Text>
          <Text style={styles.heroDescription}>{careerPath.description}</Text>
        </LinearGradient>

        {/* Key Metrics */}
        <View style={styles.metricsContainer}>
          <View style={styles.metricItem}>
            <Ionicons name="trending-up" size={24} color={colors.success} />
            <Text style={[styles.metricLabel, { color: colors.textMuted }]}>Crescimento</Text>
            <Text style={[styles.metricValue, { color: colors.text }]}>
              +{careerPath.growthProjection}%
            </Text>
          </View>
          <View style={styles.metricItem}>
            <Ionicons name="people" size={24} color={colors.primary} />
            <Text style={[styles.metricLabel, { color: colors.textMuted }]}>Demanda</Text>
            <Text style={[styles.metricValue, { color: colors.text }]}>
              {careerPath.marketDemand}/5
            </Text>
          </View>
          <View style={styles.metricItem}>
            <Ionicons name="location" size={24} color={colors.warning} />
            <Text style={[styles.metricLabel, { color: colors.textMuted }]}>Trabalho</Text>
            <Text style={[styles.metricValue, { color: colors.text }]}>
              {careerPath.workStyle}
            </Text>
          </View>
        </View>

        {/* Salary Range */}
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Faixa Salarial</Text>
          <View style={styles.salaryRange}>
            <Text style={[styles.salaryText, { color: colors.success }]}>
              R$ {careerPath.averageSalary.min.toLocaleString()} - R$ {careerPath.averageSalary.max.toLocaleString()}
            </Text>
            <Text style={[styles.salaryLocation, { color: colors.textMuted }]}>
              {careerPath.averageSalary.location}
            </Text>
          </View>
        </View>

        {/* Job Titles */}
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Cargos Relacionados</Text>
          <View style={styles.jobTitlesContainer}>
            {careerPath.jobTitles.map((title, index) => (
              <View key={index} style={[styles.jobTitle, { backgroundColor: colors.primary + '20' }]}>
                <Text style={[styles.jobTitleText, { color: colors.primary }]}>{title}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Companies */}
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Empresas que Contratam</Text>
          <View style={styles.companiesContainer}>
            {careerPath.companies.map((company, index) => (
              <Text key={index} style={[styles.companyName, { color: colors.text }]}>
                • {company}
              </Text>
            ))}
          </View>
        </View>
      </View>
    );
  };

  const renderRoadmap = () => {
    if (!careerPath) return null;

    return (
      <View style={styles.tabContent}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Roadmap de Carreira</Text>
        {careerPath.roadmap.map((milestone, index) => (
          <View key={milestone.id} style={[styles.milestoneCard, { backgroundColor: colors.surface }]}>
            <View style={styles.milestoneHeader}>
              <View style={[styles.milestoneNumber, { backgroundColor: colors.primary }]}>
                <Text style={styles.milestoneNumberText}>{index + 1}</Text>
              </View>
              <View style={styles.milestoneInfo}>
                <Text style={[styles.milestoneTitle, { color: colors.text }]}>
                  {milestone.title}
                </Text>
                <Text style={[styles.milestoneTime, { color: colors.textMuted }]}>
                  {milestone.estimatedTime} meses
                </Text>
              </View>
            </View>
            <Text style={[styles.milestoneDescription, { color: colors.textMuted }]}>
              {milestone.description}
            </Text>
            
            {/* Required Skills */}
            {milestone.requiredSkills.length > 0 && (
              <View style={styles.milestoneSkills}>
                <Text style={[styles.milestoneSkillsTitle, { color: colors.text }]}>
                  Habilidades Necessárias:
                </Text>
                <View style={styles.skillsRow}>
                  {milestone.requiredSkills.map((skillId, idx) => (
                    <View key={idx} style={[styles.skillChip, { backgroundColor: colors.primary + '20' }]}>
                      <Text style={[styles.skillChipText, { color: colors.primary }]}>
                        {skillId}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Outcomes */}
            {milestone.outcomes.length > 0 && (
              <View style={styles.milestoneOutcomes}>
                <Text style={[styles.milestoneOutcomesTitle, { color: colors.text }]}>
                  Resultados Esperados:
                </Text>
                {milestone.outcomes.map((outcome, idx) => (
                  <Text key={idx} style={[styles.outcomeItem, { color: colors.textMuted }]}>
                    ✓ {outcome}
                  </Text>
                ))}
              </View>
            )}

            {/* Projects */}
            {milestone.projects.length > 0 && (
              <View style={styles.milestoneProjects}>
                <Text style={[styles.milestoneProjectsTitle, { color: colors.text }]}>
                  Projetos Sugeridos:
                </Text>
                {milestone.projects.map((project, idx) => (
                  <TouchableOpacity key={idx} style={styles.projectItem}>
                    <Text style={[styles.projectTitle, { color: colors.primary }]}>
                      {project.title}
                    </Text>
                    <Text style={[styles.projectDescription, { color: colors.textMuted }]}>
                      {project.description}
                    </Text>
                    <Text style={[styles.projectTime, { color: colors.textMuted }]}>
                      {project.estimatedTime}h • {project.difficulty}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        ))}
      </View>
    );
  };

  const renderSkills = () => {
    if (!careerPath) return null;

    return (
      <View style={styles.tabContent}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Habilidades Necessárias</Text>
        
        {/* Required Skills */}
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Essenciais</Text>
          {careerPath.requiredSkills.map((skill, index) => (
            <View key={index} style={styles.skillRequirement}>
              <View style={styles.skillRequirementHeader}>
                <Text style={[styles.skillRequirementName, { color: colors.text }]}>
                  {skill.skillId}
                </Text>
                <View style={[styles.skillLevel, { backgroundColor: colors.warning + '20' }]}>
                  <Text style={[styles.skillLevelText, { color: colors.warning }]}>
                    {skill.level}
                  </Text>
                </View>
              </View>
              <View style={styles.skillRequirementDetails}>
                <Text style={[styles.skillImportance, { color: colors.textMuted }]}>
                  Importância: {skill.importance}/5 • Tempo: {skill.timeToLearn} meses
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Optional Skills */}
        {careerPath.optionalSkills.length > 0 && (
          <View style={[styles.card, { backgroundColor: colors.surface }]}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>Opcionais</Text>
            {careerPath.optionalSkills.map((skill, index) => (
              <View key={index} style={styles.skillRequirement}>
                <View style={styles.skillRequirementHeader}>
                  <Text style={[styles.skillRequirementName, { color: colors.text }]}>
                    {skill.skillId}
                  </Text>
                  <View style={[styles.skillLevel, { backgroundColor: colors.info + '20' }]}>
                    <Text style={[styles.skillLevelText, { color: colors.info }]}>
                      {skill.level}
                    </Text>
                  </View>
                </View>
                <View style={styles.skillRequirementDetails}>
                  <Text style={[styles.skillImportance, { color: colors.textMuted }]}>
                    Importância: {skill.importance}/5 • Tempo: {skill.timeToLearn} meses
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };

  const renderAnalytics = () => {
    return (
      <View style={styles.tabContent}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Analytics e Insights</Text>
        {renderProgressChart()}
        {renderSalaryProjection()}
        
        {analytics && (
          <>
            {/* Market Alignment */}
            <View style={[styles.card, { backgroundColor: colors.surface }]}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>Alinhamento com Mercado</Text>
              <View style={styles.alignmentContainer}>
                <View style={styles.alignmentScore}>
                  <Text style={[styles.alignmentScoreValue, { color: colors.success }]}>
                    {analytics.marketAlignment.overallAlignment}%
                  </Text>
                  <Text style={[styles.alignmentScoreLabel, { color: colors.textMuted }]}>
                    Alinhamento Geral
                  </Text>
                </View>
                <View style={styles.alignmentDetails}>
                  <Text style={[styles.alignmentTitle, { color: colors.text }]}>
                    Habilidades Emergentes:
                  </Text>
                  {analytics.marketAlignment.emergingSkills.map((skill, index) => (
                    <Text key={index} style={[styles.emergingSkill, { color: colors.success }]}>
                      • {skill}
                    </Text>
                  ))}
                </View>
              </View>
            </View>

            {/* Competitive Analysis */}
            <View style={[styles.card, { backgroundColor: colors.surface }]}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>Análise Competitiva</Text>
              <View style={styles.competitiveContainer}>
                <Text style={[styles.marketPosition, { color: colors.primary }]}>
                  Posição: {analytics.competitiveAnalysis.marketPosition}
                </Text>
                
                <Text style={[styles.strengthsTitle, { color: colors.text }]}>
                  Pontos Fortes:
                </Text>
                {analytics.competitiveAnalysis.uniqueStrengths.map((strength, index) => (
                  <Text key={index} style={[styles.strengthItem, { color: colors.success }]}>
                    ✓ {strength}
                  </Text>
                ))}
                
                <Text style={[styles.weaknessesTitle, { color: colors.text }]}>
                  Áreas de Melhoria:
                </Text>
                {analytics.competitiveAnalysis.commonWeaknesses.map((weakness, index) => (
                  <Text key={index} style={[styles.weaknessItem, { color: colors.warning }]}>
                    ⚠ {weakness}
                  </Text>
                ))}
              </View>
            </View>
          </>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <UniversalHeader title="Carregando..." showBackButton={true} minimal={true} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textMuted }]}>
            Carregando dados da trilha...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!careerPath) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <UniversalHeader title="Erro" showBackButton={true} minimal={true} />
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={64} color={colors.error} />
          <Text style={[styles.errorText, { color: colors.text }]}>
            Não foi possível carregar a trilha de carreira
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <UniversalHeader title={careerPath.title} showBackButton={true} minimal={true} />

      {/* Tab Navigation */}
      <View style={[styles.tabContainer, { backgroundColor: colors.surface }]}>
        {[
          { key: 'overview', label: 'Visão Geral', icon: 'information-circle-outline' },
          { key: 'roadmap', label: 'Roadmap', icon: 'map-outline' },
          { key: 'skills', label: 'Skills', icon: 'school-outline' },
          { key: 'analytics', label: 'Analytics', icon: 'analytics-outline' }
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tabItem,
              activeTab === tab.key && { backgroundColor: colors.primary + '20' }
            ]}
            onPress={() => setActiveTab(tab.key as any)}
          >
            <Ionicons 
              name={tab.icon as any} 
              size={20} 
              color={activeTab === tab.key ? colors.primary : colors.textMuted} 
            />
            <Text 
              style={[
                styles.tabLabel,
                { color: activeTab === tab.key ? colors.primary : colors.textMuted }
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content}>
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'roadmap' && renderRoadmap()}
        {activeTab === 'skills' && renderSkills()}
        {activeTab === 'analytics' && renderAnalytics()}
      </ScrollView>

      {/* Start Path Button */}
      <View style={[styles.buttonContainer, { backgroundColor: colors.surface }]}>
        <TouchableOpacity
          style={[styles.startButton, { backgroundColor: colors.primary }]}
          onPress={handleStartPath}
        >
          <Text style={styles.startButtonText}>Iniciar Esta Trilha</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 4,
    paddingVertical: 8,
  },
  tabItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginHorizontal: 2,
  },
  tabLabel: {
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  tabContent: {
    padding: 16,
  },
  heroSection: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  heroIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  heroDescription: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    lineHeight: 24,
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  metricItem: {
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 12,
    marginTop: 8,
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  card: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  salaryRange: {
    alignItems: 'center',
  },
  salaryText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  salaryLocation: {
    fontSize: 14,
  },
  jobTitlesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  jobTitle: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  jobTitleText: {
    fontSize: 12,
    fontWeight: '500',
  },
  companiesContainer: {
    gap: 8,
  },
  companyName: {
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  milestoneCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  milestoneHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  milestoneNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  milestoneNumberText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  milestoneInfo: {
    flex: 1,
  },
  milestoneTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  milestoneTime: {
    fontSize: 12,
  },
  milestoneDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  milestoneSkills: {
    marginBottom: 16,
  },
  milestoneSkillsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  skillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  skillChipText: {
    fontSize: 12,
    fontWeight: '500',
  },
  milestoneOutcomes: {
    marginBottom: 16,
  },
  milestoneOutcomesTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  outcomeItem: {
    fontSize: 13,
    marginBottom: 4,
  },
  milestoneProjects: {
    marginBottom: 16,
  },
  milestoneProjectsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  projectItem: {
    marginBottom: 12,
    paddingLeft: 12,
  },
  projectTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  projectDescription: {
    fontSize: 12,
    marginBottom: 4,
  },
  projectTime: {
    fontSize: 11,
  },
  skillRequirement: {
    marginBottom: 16,
  },
  skillRequirementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  skillRequirementName: {
    fontSize: 16,
    fontWeight: '600',
  },
  skillLevel: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  skillLevelText: {
    fontSize: 12,
    fontWeight: '500',
  },
  skillRequirementDetails: {
    marginLeft: 0,
  },
  skillImportance: {
    fontSize: 12,
  },
  chartContainer: {
    marginBottom: 24,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  skillProgressItem: {
    marginBottom: 16,
  },
  skillName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBarBackground: {
    flex: 1,
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    overflow: 'hidden',
    marginRight: 12,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '500',
    minWidth: 35,
  },
  salaryContainer: {
    marginBottom: 24,
  },
  salaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  salaryItem: {
    width: '48%',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 12,
    marginBottom: 12,
  },
  salaryLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  salaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  alignmentContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  alignmentScore: {
    alignItems: 'center',
    marginRight: 20,
  },
  alignmentScoreValue: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  alignmentScoreLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  alignmentDetails: {
    flex: 1,
  },
  alignmentTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  emergingSkill: {
    fontSize: 13,
    marginBottom: 4,
  },
  competitiveContainer: {
    gap: 16,
  },
  marketPosition: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  strengthsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  strengthItem: {
    fontSize: 13,
    marginBottom: 4,
  },
  weaknessesTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 8,
  },
  weaknessItem: {
    fontSize: 13,
    marginBottom: 4,
  },
  buttonContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  startButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});