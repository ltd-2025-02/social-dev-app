import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../contexts/ThemeContext';
import UniversalHeader from '../../components/UniversalHeader';
import { 
  UserCareerProfile, 
  CareerAnalytics, 
  CareerRecommendation,
  MarketInsight,
  Skill
} from '../../types/career.types';
import { CareerService } from '../../services/career.service';

const { width } = Dimensions.get('window');

interface CareerDashboardScreenProps {
  navigation: any;
}

export default function CareerDashboardScreen({ navigation }: CareerDashboardScreenProps) {
  const { colors } = useTheme();
  const [profile, setProfile] = useState<UserCareerProfile | null>(null);
  const [analytics, setAnalytics] = useState<CareerAnalytics | null>(null);
  const [recommendations, setRecommendations] = useState<CareerRecommendation[]>([]);
  const [marketInsights, setMarketInsights] = useState<MarketInsight[]>([]);
  const [topSkills, setTopSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const careerService = new CareerService();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [
        profileData,
        analyticsData,
        recommendationsData,
        insightsData,
        skillsData
      ] = await Promise.all([
        careerService.getUserCareerProfile('user-id'), // Replace with actual user ID
        careerService.getUserCareerAnalytics('user-id'),
        careerService.getCareerRecommendations('user-id'),
        careerService.getMarketInsights(),
        careerService.getSkills()
      ]);

      setProfile(profileData);
      setAnalytics(analyticsData);
      setRecommendations(recommendationsData);
      setMarketInsights(insightsData.slice(0, 3)); // Top 3 insights
      setTopSkills(skillsData.slice(0, 5)); // Top 5 trending skills
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
  };

  const renderProgressOverview = () => {
    if (!analytics || !profile) return null;

    const overallProgress = analytics.careerProgress.overallProgress;
    const completedMilestones = analytics.careerProgress.milestonesCompleted;
    const totalMilestones = analytics.careerProgress.totalMilestones;
    const timeToNext = analytics.careerProgress.estimatedTimeToNextLevel;

    return (
      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>Progresso da Carreira</Text>
        
        {/* Circular Progress */}
        <View style={styles.progressContainer}>
          <View style={styles.circularProgress}>
            <View style={[styles.progressCircle, { borderColor: colors.primary }]}>
              <Text style={[styles.progressPercentage, { color: colors.primary }]}>
                {overallProgress}%
              </Text>
              <Text style={[styles.progressLabel, { color: colors.textMuted }]}>
                Completo
              </Text>
            </View>
          </View>
          
          <View style={styles.progressStats}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.text }]}>
                {completedMilestones}/{totalMilestones}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textMuted }]}>
                Marcos Atingidos
              </Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.text }]}>
                {timeToNext}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textMuted }]}>
                Meses p/ Próximo Nível
              </Text>
            </View>
          </View>
        </View>

        {/* Current Path */}
        {profile.currentPath && (
          <TouchableOpacity 
            style={styles.currentPathContainer}
            onPress={() => navigation.navigate('CareerPathDetail', { pathId: profile.currentPath })}
          >
            <Text style={[styles.currentPathLabel, { color: colors.textMuted }]}>
              Trilha Atual:
            </Text>
            <View style={styles.currentPathInfo}>
              <Text style={[styles.currentPathTitle, { color: colors.primary }]}>
                {profile.currentPath}
              </Text>
              <Ionicons name="chevron-forward" size={16} color={colors.primary} />
            </View>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderSkillGrowthChart = () => {
    if (!analytics) return null;

    const topGrowingSkills = analytics.skillGrowth
      .filter(skill => skill.trend === 'improving')
      .slice(0, 4);

    return (
      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        <View style={styles.cardHeader}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Crescimento de Habilidades</Text>
          <TouchableOpacity onPress={() => navigation.navigate('SkillsAnalytics')}>
            <Text style={[styles.seeAllText, { color: colors.primary }]}>Ver todas</Text>
          </TouchableOpacity>
        </View>

        {topGrowingSkills.map((skill, index) => {
          const latestLevel = skill.history[skill.history.length - 1]?.level || 0;
          const previousLevel = skill.history[skill.history.length - 2]?.level || 0;
          const growth = ((latestLevel - previousLevel) / previousLevel * 100) || 0;

          return (
            <View key={skill.skillId} style={styles.skillGrowthItem}>
              <View style={styles.skillGrowthInfo}>
                <Text style={[styles.skillName, { color: colors.text }]}>
                  {skill.skillName}
                </Text>
                <Text style={[styles.skillGrowth, { color: colors.success }]}>
                  +{growth.toFixed(1)}%
                </Text>
              </View>
              
              <View style={styles.skillProgressBar}>
                <View style={styles.skillProgressBackground}>
                  <View 
                    style={[
                      styles.skillProgressFill,
                      { 
                        width: `${latestLevel * 25}%`,
                        backgroundColor: colors.primary 
                      }
                    ]} 
                  />
                </View>
              </View>
            </View>
          );
        })}
      </View>
    );
  };

  const renderSalaryInsights = () => {
    if (!analytics) return null;

    const { currentSalaryRange, projectedSalary, benchmarkData } = analytics.salaryProgression;
    const yearlyGrowth = ((projectedSalary.oneYear - currentSalaryRange.min) / currentSalaryRange.min * 100);

    return (
      <LinearGradient
        colors={[colors.primary, colors.primary + '80']}
        style={styles.salaryCard}
      >
        <View style={styles.salaryHeader}>
          <Ionicons name="trending-up" size={24} color="#fff" />
          <Text style={styles.salaryTitle}>Perspectiva Salarial</Text>
        </View>

        <View style={styles.salaryContent}>
          <View style={styles.salaryCurrentContainer}>
            <Text style={styles.salaryCurrentLabel}>Faixa Atual</Text>
            <Text style={styles.salaryCurrentValue}>
              R$ {currentSalaryRange.min.toLocaleString()} - R$ {currentSalaryRange.max.toLocaleString()}
            </Text>
          </View>

          <View style={styles.salaryProjectionContainer}>
            <View style={styles.salaryProjectionItem}>
              <Text style={styles.salaryProjectionLabel}>1 Ano</Text>
              <Text style={styles.salaryProjectionValue}>
                R$ {projectedSalary.oneYear.toLocaleString()}
              </Text>
            </View>
            <View style={styles.salaryProjectionItem}>
              <Text style={styles.salaryProjectionLabel}>3 Anos</Text>
              <Text style={styles.salaryProjectionValue}>
                R$ {projectedSalary.threeYears.toLocaleString()}
              </Text>
            </View>
          </View>

          <View style={styles.salaryBenchmark}>
            <Text style={styles.salaryBenchmarkText}>
              Você está no percentil {benchmarkData.percentile} do mercado
            </Text>
            <Text style={styles.salaryGrowthText}>
              Crescimento projetado: +{yearlyGrowth.toFixed(1)}% ao ano
            </Text>
          </View>
        </View>
      </LinearGradient>
    );
  };

  const renderRecommendations = () => {
    const priorityRecs = recommendations.filter(r => r.priority === 'high').slice(0, 3);
    
    return (
      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        <View style={styles.cardHeader}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Recomendações Personalizadas</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Recommendations')}>
            <Text style={[styles.seeAllText, { color: colors.primary }]}>Ver todas</Text>
          </TouchableOpacity>
        </View>

        {priorityRecs.map((rec, index) => (
          <TouchableOpacity key={rec.id} style={styles.recommendationItem}>
            <View style={[styles.recIcon, { backgroundColor: colors.primary + '20' }]}>
              <Ionicons 
                name={rec.type === 'skill' ? 'school-outline' : 
                      rec.type === 'certification' ? 'ribbon-outline' : 'briefcase-outline'} 
                size={20} 
                color={colors.primary} 
              />
            </View>
            
            <View style={styles.recContent}>
              <Text style={[styles.recTitle, { color: colors.text }]}>
                {rec.title}
              </Text>
              <Text style={[styles.recDescription, { color: colors.textMuted }]}>
                {rec.description}
              </Text>
              <View style={styles.recMeta}>
                <View style={[styles.recPriority, { backgroundColor: colors.warning + '20' }]}>
                  <Text style={[styles.recPriorityText, { color: colors.warning }]}>
                    Alta Prioridade
                  </Text>
                </View>
                <Text style={[styles.recTimeline, { color: colors.textMuted }]}>
                  {rec.timeline} meses
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderMarketInsights = () => {
    return (
      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        <View style={styles.cardHeader}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Insights do Mercado</Text>
          <TouchableOpacity onPress={() => navigation.navigate('MarketInsights')}>
            <Text style={[styles.seeAllText, { color: colors.primary }]}>Ver mais</Text>
          </TouchableOpacity>
        </View>

        {marketInsights.map((insight, index) => (
          <View key={insight.id} style={styles.insightItem}>
            <View style={styles.insightHeader}>
              <View style={[styles.insightIcon, { backgroundColor: colors.info + '20' }]}>
                <Ionicons name="analytics-outline" size={16} color={colors.info} />
              </View>
              <View style={styles.insightInfo}>
                <Text style={[styles.insightTitle, { color: colors.text }]}>
                  {insight.title}
                </Text>
                <Text style={[styles.insightSource, { color: colors.textMuted }]}>
                  {insight.source}
                </Text>
              </View>
              <View style={[
                styles.insightImpact, 
                { backgroundColor: insight.impact === 'high' ? colors.error + '20' : 
                                  insight.impact === 'medium' ? colors.warning + '20' : 
                                  colors.success + '20' }
              ]}>
                <Text style={[
                  styles.insightImpactText,
                  { color: insight.impact === 'high' ? colors.error : 
                           insight.impact === 'medium' ? colors.warning : 
                           colors.success }
                ]}>
                  {insight.impact.toUpperCase()}
                </Text>
              </View>
            </View>
            <Text style={[styles.insightDescription, { color: colors.textMuted }]}>
              {insight.description}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  const renderTrendingSkills = () => {
    return (
      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        <View style={styles.cardHeader}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Skills em Alta</Text>
          <TouchableOpacity onPress={() => navigation.navigate('SkillsExplorer')}>
            <Text style={[styles.seeAllText, { color: colors.primary }]}>Explorar</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.trendingSkillsContainer}>
            {topSkills.map((skill, index) => (
              <TouchableOpacity 
                key={skill.id} 
                style={[styles.trendingSkillItem, { backgroundColor: colors.background }]}
                onPress={() => navigation.navigate('SkillDetail', { skillId: skill.id })}
              >
                <View style={[styles.trendingSkillIcon, { backgroundColor: skill.color + '20' }]}>
                  <Ionicons name="code-outline" size={24} color={skill.color} />
                </View>
                <Text style={[styles.trendingSkillName, { color: colors.text }]}>
                  {skill.name}
                </Text>
                <Text style={[styles.trendingSkillCategory, { color: colors.textMuted }]}>
                  {skill.category}
                </Text>
                <View style={styles.trendingSkillMeta}>
                  <Text style={[styles.trendingSkillDemand, { color: colors.success }]}>
                    Demanda: {skill.marketDemand}/5
                  </Text>
                  <Text style={[styles.trendingSkillSalary, { color: colors.primary }]}>
                    +{skill.averageSalaryImpact}%
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    );
  };

  const renderQuickActions = () => {
    const actions = [
      { 
        title: 'Explorar Trilhas', 
        icon: 'map-outline', 
        color: colors.primary,
        onPress: () => navigation.navigate('CareerPaths')
      },
      { 
        title: 'Avaliar Skills', 
        icon: 'checkmark-circle-outline', 
        color: colors.success,
        onPress: () => navigation.navigate('SkillAssessment')
      },
      { 
        title: 'Ver Relatório', 
        icon: 'document-text-outline', 
        color: colors.info,
        onPress: () => navigation.navigate('CareerReport')
      },
      { 
        title: 'Buscar Mentores', 
        icon: 'people-outline', 
        color: colors.warning,
        onPress: () => navigation.navigate('Mentors')
      },
    ];

    return (
      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>Ações Rápidas</Text>
        <View style={styles.quickActionsGrid}>
          {actions.map((action, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.quickActionItem}
              onPress={action.onPress}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: action.color + '20' }]}>
                <Ionicons name={action.icon as any} size={24} color={action.color} />
              </View>
              <Text style={[styles.quickActionTitle, { color: colors.text }]}>
                {action.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <UniversalHeader title="Career Dashboard" showBackButton={true} minimal={true} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textMuted }]}>
            Carregando dashboard...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <UniversalHeader title="Career Dashboard" showBackButton={true} minimal={true} />

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {renderProgressOverview()}
        {renderSalaryInsights()}
        {renderSkillGrowthChart()}
        {renderRecommendations()}
        {renderMarketInsights()}
        {renderTrendingSkills()}
        {renderQuickActions()}
      </ScrollView>
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
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  circularProgress: {
    marginRight: 24,
  },
  progressCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 6,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  progressPercentage: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  progressLabel: {
    fontSize: 12,
  },
  progressStats: {
    flex: 1,
  },
  statItem: {
    marginBottom: 12,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  currentPathContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  currentPathLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  currentPathInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentPathTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  skillGrowthItem: {
    marginBottom: 16,
  },
  skillGrowthInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  skillName: {
    fontSize: 14,
    fontWeight: '600',
  },
  skillGrowth: {
    fontSize: 12,
    fontWeight: '500',
  },
  skillProgressBar: {
    flex: 1,
  },
  skillProgressBackground: {
    height: 6,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  skillProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  salaryCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
  },
  salaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  salaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 12,
  },
  salaryContent: {
    gap: 16,
  },
  salaryCurrentContainer: {
    alignItems: 'center',
  },
  salaryCurrentLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 4,
  },
  salaryCurrentValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  salaryProjectionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  salaryProjectionItem: {
    alignItems: 'center',
  },
  salaryProjectionLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 4,
  },
  salaryProjectionValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  salaryBenchmark: {
    alignItems: 'center',
  },
  salaryBenchmarkText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 4,
  },
  salaryGrowthText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  recommendationItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  recIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  recContent: {
    flex: 1,
  },
  recTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  recDescription: {
    fontSize: 13,
    marginBottom: 8,
    lineHeight: 18,
  },
  recMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  recPriority: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  recPriorityText: {
    fontSize: 10,
    fontWeight: '500',
  },
  recTimeline: {
    fontSize: 12,
  },
  insightItem: {
    marginBottom: 16,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  insightIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  insightInfo: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  insightSource: {
    fontSize: 12,
  },
  insightImpact: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  insightImpactText: {
    fontSize: 10,
    fontWeight: '600',
  },
  insightDescription: {
    fontSize: 13,
    lineHeight: 18,
    marginLeft: 44,
  },
  trendingSkillsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  trendingSkillItem: {
    width: 140,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  trendingSkillIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  trendingSkillName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  trendingSkillCategory: {
    fontSize: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  trendingSkillMeta: {
    gap: 4,
    alignItems: 'center',
  },
  trendingSkillDemand: {
    fontSize: 10,
    fontWeight: '500',
  },
  trendingSkillSalary: {
    fontSize: 10,
    fontWeight: '500',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickActionItem: {
    width: (width - 64) / 2,
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.03)',
    borderRadius: 12,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickActionTitle: {
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
  },
});