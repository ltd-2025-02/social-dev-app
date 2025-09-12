import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../contexts/ThemeContext';
import UniversalHeader from '../../components/UniversalHeader';
import { 
  CareerAnalytics, 
  SkillGrowthData, 
  UserSkill,
  MarketAlignmentData 
} from '../../types/career.types';
import { CareerService } from '../../services/career.service';

const { width } = Dimensions.get('window');

interface SkillsAnalyticsScreenProps {
  navigation: any;
}

// Simple Chart Components (since we can't use external charting libraries easily)
const ProgressChart = ({ data, colors }: { data: any[], colors: any }) => {
  return (
    <View style={styles.chartContainer}>
      {data.map((item, index) => {
        const percentage = Math.max(5, item.progress || 0); // Minimum 5% for visibility
        const barWidth = (width - 120) * (percentage / 100);
        
        return (
          <View key={index} style={styles.chartItem}>
            <Text style={[styles.chartLabel, { color: colors.text }]} numberOfLines={1}>
              {item.name}
            </Text>
            <View style={styles.chartBarContainer}>
              <View style={[styles.chartBarBackground, { backgroundColor: colors.border }]}>
                <LinearGradient
                  colors={[item.color || colors.primary, (item.color || colors.primary) + '60']}
                  style={[styles.chartBarFill, { width: barWidth }]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                />
              </View>
              <Text style={[styles.chartValue, { color: colors.textMuted }]}>
                {percentage.toFixed(0)}%
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
};

const RadarChart = ({ data, colors }: { data: any[], colors: any }) => {
  // Simplified radar chart representation
  const maxValue = Math.max(...data.map(d => d.value));
  
  return (
    <View style={styles.radarContainer}>
      <View style={styles.radarCenter}>
        {data.map((item, index) => {
          const angle = (index * 2 * Math.PI) / data.length - Math.PI / 2;
          const radius = 60;
          const value = (item.value / maxValue) * radius;
          const x = Math.cos(angle) * value;
          const y = Math.sin(angle) * value;
          
          return (
            <View
              key={index}
              style={[
                styles.radarPoint,
                {
                  backgroundColor: item.color || colors.primary,
                  transform: [{ translateX: x }, { translateY: y }]
                }
              ]}
            />
          );
        })}
      </View>
      
      <View style={styles.radarLabels}>
        {data.map((item, index) => (
          <View key={index} style={styles.radarLabelItem}>
            <View style={[styles.radarLabelColor, { backgroundColor: item.color || colors.primary }]} />
            <Text style={[styles.radarLabelText, { color: colors.text }]} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={[styles.radarLabelValue, { color: colors.textMuted }]}>
              {item.value.toFixed(1)}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const TrendChart = ({ data, colors }: { data: any[], colors: any }) => {
  if (!data.length) return null;
  
  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue;
  
  return (
    <View style={styles.trendContainer}>
      <View style={styles.trendChart}>
        {data.map((point, index) => {
          const height = range > 0 ? ((point.value - minValue) / range) * 60 + 10 : 35;
          const left = (index / (data.length - 1)) * (width - 120);
          
          return (
            <View key={index} style={styles.trendPointContainer}>
              <View
                style={[
                  styles.trendPoint,
                  {
                    height,
                    left,
                    backgroundColor: colors.primary,
                  }
                ]}
              />
              <Text style={[styles.trendLabel, { left, color: colors.textMuted }]}>
                {point.label}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default function SkillsAnalyticsScreen({ navigation }: SkillsAnalyticsScreenProps) {
  const { colors } = useTheme();
  const [analytics, setAnalytics] = useState<CareerAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<'growth' | 'comparison' | 'market' | 'trends'>('growth');

  const careerService = new CareerService();

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = async () => {
    try {
      const data = await careerService.getUserCareerAnalytics('user-id'); // Replace with actual user ID
      setAnalytics(data);
    } catch (error) {
      console.error('Error loading analytics:', error);
      // Mock data for demonstration
      setAnalytics({
        userId: 'user-id',
        skillGrowth: [
          {
            skillId: 'js',
            skillName: 'JavaScript',
            history: [
              { date: new Date('2024-01-01'), level: 2, confidence: 3 },
              { date: new Date('2024-06-01'), level: 3, confidence: 4 },
              { date: new Date('2024-12-01'), level: 4, confidence: 4 }
            ],
            trend: 'improving',
            projectedGrowth: 25
          },
          {
            skillId: 'react',
            skillName: 'React',
            history: [
              { date: new Date('2024-01-01'), level: 2, confidence: 2 },
              { date: new Date('2024-06-01'), level: 3, confidence: 3 },
              { date: new Date('2024-12-01'), level: 3, confidence: 4 }
            ],
            trend: 'improving',
            projectedGrowth: 15
          },
          {
            skillId: 'python',
            skillName: 'Python',
            history: [
              { date: new Date('2024-01-01'), level: 1, confidence: 2 },
              { date: new Date('2024-06-01'), level: 2, confidence: 3 },
              { date: new Date('2024-12-01'), level: 2, confidence: 3 }
            ],
            trend: 'stable',
            projectedGrowth: 10
          },
          {
            skillId: 'typescript',
            skillName: 'TypeScript',
            history: [
              { date: new Date('2024-01-01'), level: 1, confidence: 1 },
              { date: new Date('2024-06-01'), level: 2, confidence: 2 },
              { date: new Date('2024-12-01'), level: 3, confidence: 3 }
            ],
            trend: 'improving',
            projectedGrowth: 30
          },
          {
            skillId: 'nodejs',
            skillName: 'Node.js',
            history: [
              { date: new Date('2024-01-01'), level: 2, confidence: 2 },
              { date: new Date('2024-06-01'), level: 3, confidence: 3 },
              { date: new Date('2024-12-01'), level: 3, confidence: 4 }
            ],
            trend: 'improving',
            projectedGrowth: 20
          }
        ],
        careerProgress: {
          overallProgress: 65,
          milestonesCompleted: 12,
          totalMilestones: 20,
          estimatedTimeToNextLevel: 8,
          skillGaps: [],
          strengths: ['Frontend Development', 'Problem Solving'],
          areasForImprovement: ['Backend Architecture', 'DevOps']
        },
        marketAlignment: {
          overallAlignment: 78,
          skillMarketDemand: [
            { skillId: 'js', skillName: 'JavaScript', userLevel: 'advanced', marketDemand: 5, salaryPotential: 85 },
            { skillId: 'react', skillName: 'React', userLevel: 'intermediate', marketDemand: 5, salaryPotential: 90 },
            { skillId: 'typescript', skillName: 'TypeScript', userLevel: 'intermediate', marketDemand: 4, salaryPotential: 75 },
          ],
          emergingSkills: ['Next.js', 'GraphQL', 'Docker'],
          decliningSkills: ['jQuery', 'PHP'],
          recommendations: ['Focus on TypeScript mastery', 'Learn cloud platforms']
        },
        learningVelocity: {
          averageTimePerSkill: 6,
          completionRate: 82,
          preferredLearningMethods: ['hands-on projects', 'documentation', 'video tutorials'],
          peakLearningTimes: ['evening', 'weekend'],
          strugglingAreas: ['backend concepts', 'system design'],
          accelerationOpportunities: ['structured learning path', 'mentorship']
        },
        salaryProgression: {
          currentSalaryRange: { min: 5000, max: 8000, currency: 'BRL' },
          projectedSalary: { oneYear: 9000, threeYears: 15000, fiveYears: 22000 },
          salaryDrivers: [
            { skill: 'JavaScript', impact: 25 },
            { skill: 'React', impact: 30 },
            { skill: 'TypeScript', impact: 20 }
          ],
          benchmarkData: { percentile: 75, medianSalary: 7000, location: 'Brasil' }
        },
        competitiveAnalysis: {
          marketPosition: 'above-average',
          skillCompetitiveness: [],
          uniqueStrengths: ['Full-stack thinking', 'Modern frameworks'],
          commonWeaknesses: ['System design', 'Database optimization'],
          differentiationOpportunities: ['Specialization in React ecosystem', 'Leadership skills']
        },
        recommendations: [],
        updatedAt: new Date()
      });
    } finally {
      setLoading(false);
    }
  };

  const renderGrowthView = () => {
    if (!analytics) return null;

    const chartData = analytics.skillGrowth.map(skill => ({
      name: skill.skillName,
      progress: skill.history[skill.history.length - 1]?.level * 25 || 0,
      color: skill.trend === 'improving' ? '#10b981' : 
             skill.trend === 'stable' ? '#f59e0b' : '#ef4444'
    }));

    return (
      <View style={styles.viewContainer}>
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Crescimento de Habilidades</Text>
          <ProgressChart data={chartData} colors={colors} />
        </View>

        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Tendências</Text>
          <View style={styles.trendsContainer}>
            {analytics.skillGrowth.map((skill, index) => (
              <View key={index} style={styles.trendItem}>
                <View style={styles.trendHeader}>
                  <Text style={[styles.trendSkillName, { color: colors.text }]}>
                    {skill.skillName}
                  </Text>
                  <View style={[
                    styles.trendIndicator,
                    { backgroundColor: skill.trend === 'improving' ? colors.success + '20' : 
                                     skill.trend === 'stable' ? colors.warning + '20' : 
                                     colors.error + '20' }
                  ]}>
                    <Ionicons 
                      name={skill.trend === 'improving' ? 'trending-up' : 
                            skill.trend === 'stable' ? 'remove' : 'trending-down'} 
                      size={16} 
                      color={skill.trend === 'improving' ? colors.success : 
                             skill.trend === 'stable' ? colors.warning : 
                             colors.error} 
                    />
                    <Text style={[
                      styles.trendText,
                      { color: skill.trend === 'improving' ? colors.success : 
                               skill.trend === 'stable' ? colors.warning : 
                               colors.error }
                    ]}>
                      {skill.trend === 'improving' ? 'Crescendo' : 
                       skill.trend === 'stable' ? 'Estável' : 'Declining'}
                    </Text>
                  </View>
                </View>
                <Text style={[styles.projectedGrowth, { color: colors.textMuted }]}>
                  Projeção: +{skill.projectedGrowth}% em 12 meses
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    );
  };

  const renderComparisonView = () => {
    if (!analytics) return null;

    const radarData = analytics.skillGrowth.slice(0, 5).map((skill, index) => ({
      name: skill.skillName,
      value: skill.history[skill.history.length - 1]?.level * 25 || 0,
      color: `hsl(${index * 60}, 70%, 60%)`
    }));

    return (
      <View style={styles.viewContainer}>
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Comparação de Habilidades</Text>
          <RadarChart data={radarData} colors={colors} />
        </View>

        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Análise Competitiva</Text>
          <View style={styles.competitiveContainer}>
            <View style={styles.positionCard}>
              <Text style={[styles.positionLabel, { color: colors.textMuted }]}>
                Sua Posição no Mercado
              </Text>
              <Text style={[styles.positionValue, { color: colors.primary }]}>
                {analytics.competitiveAnalysis.marketPosition.replace('-', ' ').toUpperCase()}
              </Text>
              <Text style={[styles.positionPercentile, { color: colors.textMuted }]}>
                Percentil {analytics.salaryProgression.benchmarkData.percentile}
              </Text>
            </View>

            <View style={styles.strengthsContainer}>
              <Text style={[styles.strengthsTitle, { color: colors.text }]}>
                Pontos Fortes Únicos
              </Text>
              {analytics.competitiveAnalysis.uniqueStrengths.map((strength, index) => (
                <View key={index} style={styles.strengthItem}>
                  <Ionicons name="checkmark-circle" size={16} color={colors.success} />
                  <Text style={[styles.strengthText, { color: colors.text }]}>
                    {strength}
                  </Text>
                </View>
              ))}
            </View>

            <View style={styles.opportunitiesContainer}>
              <Text style={[styles.opportunitiesTitle, { color: colors.text }]}>
                Oportunidades de Diferenciação
              </Text>
              {analytics.competitiveAnalysis.differentiationOpportunities.map((opp, index) => (
                <View key={index} style={styles.opportunityItem}>
                  <Ionicons name="bulb-outline" size={16} color={colors.warning} />
                  <Text style={[styles.opportunityText, { color: colors.text }]}>
                    {opp}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderMarketView = () => {
    if (!analytics) return null;

    return (
      <View style={styles.viewContainer}>
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Alinhamento com Mercado</Text>
          <View style={styles.alignmentScore}>
            <Text style={[styles.alignmentPercentage, { color: colors.success }]}>
              {analytics.marketAlignment.overallAlignment}%
            </Text>
            <Text style={[styles.alignmentLabel, { color: colors.textMuted }]}>
              Alinhamento Geral
            </Text>
          </View>

          <View style={styles.skillMarketContainer}>
            {analytics.marketAlignment.skillMarketDemand.map((skill, index) => (
              <View key={index} style={styles.skillMarketItem}>
                <View style={styles.skillMarketHeader}>
                  <Text style={[styles.skillMarketName, { color: colors.text }]}>
                    {skill.skillName}
                  </Text>
                  <Text style={[styles.skillMarketLevel, { color: colors.primary }]}>
                    {skill.userLevel}
                  </Text>
                </View>
                
                <View style={styles.skillMarketMeta}>
                  <View style={styles.skillMarketDemand}>
                    <Text style={[styles.skillMarketLabel, { color: colors.textMuted }]}>
                      Demanda
                    </Text>
                    <View style={styles.starsContainer}>
                      {Array.from({ length: 5 }).map((_, starIndex) => (
                        <Ionicons
                          key={starIndex}
                          name="star"
                          size={12}
                          color={starIndex < skill.marketDemand ? colors.warning : colors.border}
                        />
                      ))}
                    </View>
                  </View>
                  
                  <View style={styles.skillMarketPotential}>
                    <Text style={[styles.skillMarketLabel, { color: colors.textMuted }]}>
                      Potencial Salarial
                    </Text>
                    <Text style={[styles.skillMarketValue, { color: colors.success }]}>
                      {skill.salaryPotential}%
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Skills Emergentes</Text>
          <View style={styles.emergingSkillsContainer}>
            {analytics.marketAlignment.emergingSkills.map((skill, index) => (
              <View key={index} style={[styles.emergingSkillItem, { backgroundColor: colors.success + '20' }]}>
                <Ionicons name="trending-up" size={16} color={colors.success} />
                <Text style={[styles.emergingSkillText, { color: colors.success }]}>
                  {skill}
                </Text>
              </View>
            ))}
          </View>

          <Text style={[styles.cardTitle, { color: colors.text, marginTop: 20 }]}>Skills em Declínio</Text>
          <View style={styles.decliningSkillsContainer}>
            {analytics.marketAlignment.decliningSkills.map((skill, index) => (
              <View key={index} style={[styles.decliningSkillItem, { backgroundColor: colors.error + '20' }]}>
                <Ionicons name="trending-down" size={16} color={colors.error} />
                <Text style={[styles.decliningSkillText, { color: colors.error }]}>
                  {skill}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    );
  };

  const renderTrendsView = () => {
    if (!analytics) return null;

    const trendData = analytics.skillGrowth.slice(0, 3).map((skill, index) => ({
      label: skill.skillName.substring(0, 3),
      value: skill.projectedGrowth,
    }));

    return (
      <View style={styles.viewContainer}>
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Projeção de Crescimento</Text>
          <TrendChart data={trendData} colors={colors} />
        </View>

        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Velocidade de Aprendizado</Text>
          <View style={styles.learningStatsContainer}>
            <View style={styles.learningStatItem}>
              <Text style={[styles.learningStatValue, { color: colors.primary }]}>
                {analytics.learningVelocity.averageTimePerSkill} meses
              </Text>
              <Text style={[styles.learningStatLabel, { color: colors.textMuted }]}>
                Tempo médio por skill
              </Text>
            </View>
            
            <View style={styles.learningStatItem}>
              <Text style={[styles.learningStatValue, { color: colors.success }]}>
                {analytics.learningVelocity.completionRate}%
              </Text>
              <Text style={[styles.learningStatLabel, { color: colors.textMuted }]}>
                Taxa de conclusão
              </Text>
            </View>
          </View>

          <View style={styles.learningMethodsContainer}>
            <Text style={[styles.learningMethodsTitle, { color: colors.text }]}>
              Métodos Preferidos de Aprendizado
            </Text>
            {analytics.learningVelocity.preferredLearningMethods.map((method, index) => (
              <View key={index} style={styles.learningMethodItem}>
                <View style={[styles.learningMethodIndicator, { backgroundColor: colors.primary }]} />
                <Text style={[styles.learningMethodText, { color: colors.text }]}>
                  {method}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.accelerationContainer}>
            <Text style={[styles.accelerationTitle, { color: colors.text }]}>
              Oportunidades de Aceleração
            </Text>
            {analytics.learningVelocity.accelerationOpportunities.map((opp, index) => (
              <View key={index} style={styles.accelerationItem}>
                <Ionicons name="flash-outline" size={16} color={colors.warning} />
                <Text style={[styles.accelerationText, { color: colors.text }]}>
                  {opp}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <UniversalHeader title="Analytics de Skills" showBackButton={true} minimal={true} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textMuted }]}>
            Carregando analytics...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <UniversalHeader title="Analytics de Skills" showBackButton={true} minimal={true} />

      {/* Tab Navigation */}
      <View style={[styles.tabContainer, { backgroundColor: colors.surface }]}>
        {[
          { key: 'growth', label: 'Crescimento', icon: 'trending-up-outline' },
          { key: 'comparison', label: 'Comparação', icon: 'stats-chart-outline' },
          { key: 'market', label: 'Mercado', icon: 'globe-outline' },
          { key: 'trends', label: 'Tendências', icon: 'pulse-outline' }
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tabItem,
              activeView === tab.key && { backgroundColor: colors.primary + '20' }
            ]}
            onPress={() => setActiveView(tab.key as any)}
          >
            <Ionicons 
              name={tab.icon as any} 
              size={18} 
              color={activeView === tab.key ? colors.primary : colors.textMuted} 
            />
            <Text 
              style={[
                styles.tabLabel,
                { color: activeView === tab.key ? colors.primary : colors.textMuted }
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content}>
        {activeView === 'growth' && renderGrowthView()}
        {activeView === 'comparison' && renderComparisonView()}
        {activeView === 'market' && renderMarketView()}
        {activeView === 'trends' && renderTrendsView()}
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
    paddingHorizontal: 8,
    borderRadius: 8,
    marginHorizontal: 2,
  },
  tabLabel: {
    fontSize: 11,
    marginLeft: 4,
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  viewContainer: {
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
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  // Chart Styles
  chartContainer: {
    marginTop: 8,
  },
  chartItem: {
    marginBottom: 16,
  },
  chartLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    width: 80,
  },
  chartBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chartBarBackground: {
    height: 8,
    flex: 1,
    borderRadius: 4,
    marginRight: 12,
    overflow: 'hidden',
  },
  chartBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  chartValue: {
    fontSize: 12,
    fontWeight: '500',
    minWidth: 35,
  },
  // Radar Chart Styles
  radarContainer: {
    alignItems: 'center',
  },
  radarCenter: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  radarPoint: {
    width: 8,
    height: 8,
    borderRadius: 4,
    position: 'absolute',
  },
  radarLabels: {
    gap: 8,
  },
  radarLabelItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radarLabelColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  radarLabelText: {
    fontSize: 12,
    flex: 1,
  },
  radarLabelValue: {
    fontSize: 12,
    fontWeight: '500',
  },
  // Trend Chart Styles
  trendContainer: {
    marginTop: 8,
  },
  trendChart: {
    height: 80,
    position: 'relative',
  },
  trendPointContainer: {
    position: 'absolute',
    bottom: 0,
  },
  trendPoint: {
    width: 4,
    borderRadius: 2,
  },
  trendLabel: {
    fontSize: 10,
    position: 'absolute',
    bottom: -20,
    transform: [{ translateX: -10 }],
  },
  // Trends Styles
  trendsContainer: {
    gap: 16,
  },
  trendItem: {
    borderRadius: 12,
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.03)',
  },
  trendHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  trendSkillName: {
    fontSize: 14,
    fontWeight: '600',
  },
  trendIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  trendText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  projectedGrowth: {
    fontSize: 12,
  },
  // Competitive Analysis Styles
  competitiveContainer: {
    gap: 20,
  },
  positionCard: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.03)',
    borderRadius: 12,
  },
  positionLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  positionValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  positionPercentile: {
    fontSize: 12,
  },
  strengthsContainer: {
    gap: 8,
  },
  strengthsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  strengthItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  strengthText: {
    fontSize: 13,
  },
  opportunitiesContainer: {
    gap: 8,
  },
  opportunitiesTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  opportunityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  opportunityText: {
    fontSize: 13,
  },
  // Market Alignment Styles
  alignmentScore: {
    alignItems: 'center',
    marginBottom: 24,
  },
  alignmentPercentage: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  alignmentLabel: {
    fontSize: 14,
  },
  skillMarketContainer: {
    gap: 16,
  },
  skillMarketItem: {
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.03)',
    borderRadius: 12,
  },
  skillMarketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  skillMarketName: {
    fontSize: 14,
    fontWeight: '600',
  },
  skillMarketLevel: {
    fontSize: 12,
    fontWeight: '500',
  },
  skillMarketMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  skillMarketDemand: {
    alignItems: 'center',
  },
  skillMarketLabel: {
    fontSize: 11,
    marginBottom: 4,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  skillMarketPotential: {
    alignItems: 'center',
  },
  skillMarketValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  emergingSkillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  emergingSkillItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  emergingSkillText: {
    fontSize: 12,
    fontWeight: '500',
  },
  decliningSkillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  decliningSkillItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  decliningSkillText: {
    fontSize: 12,
    fontWeight: '500',
  },
  // Learning Velocity Styles
  learningStatsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  learningStatItem: {
    alignItems: 'center',
  },
  learningStatValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  learningStatLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  learningMethodsContainer: {
    marginBottom: 24,
  },
  learningMethodsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  learningMethodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  learningMethodIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  learningMethodText: {
    fontSize: 13,
  },
  accelerationContainer: {
    gap: 8,
  },
  accelerationTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  accelerationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  accelerationText: {
    fontSize: 13,
  },
});