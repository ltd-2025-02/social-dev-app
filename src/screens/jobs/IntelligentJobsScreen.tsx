import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  Alert,
  Dimensions,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { jobsService } from '../../services/jobs.service';
import { enhancedProfileService } from '../../services/profile.service.enhanced';
import { JobMatchScore, UserProfileAnalysis } from '../../services/profile-matching.service';
import UniversalHeader from '../../components/UniversalHeader';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function IntelligentJobsScreen({ navigation }: any) {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [jobMatches, setJobMatches] = useState<JobMatchScore[]>([]);
  const [growthOpportunities, setGrowthOpportunities] = useState<JobMatchScore[]>([]);
  const [userAnalysis, setUserAnalysis] = useState<UserProfileAnalysis | null>(null);
  const [searchMode, setSearchMode] = useState<'personalized' | 'growth' | 'all'>('personalized');
  const [showAnalysis, setShowAnalysis] = useState(false);

  useEffect(() => {
    loadIntelligentJobs();
  }, [user]);

  const loadIntelligentJobs = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Load user profile and skills
      const profile = await enhancedProfileService.getUserProfile(user.id);
      const skills = await enhancedProfileService.getUserSkills(user.id);

      if (profile && skills.length > 0) {
        // Get personalized recommendations
        const recommendations = await jobsService.getPersonalizedRecommendations(profile, skills, 15);
        setJobMatches(recommendations);

        // Get growth opportunities
        const growth = await jobsService.getGrowthOpportunities(profile, skills);
        setGrowthOpportunities(growth);

        // Get user analysis
        const analysis = jobsService.getUserProfileAnalysis();
        setUserAnalysis(analysis);

        console.log(`Loaded ${recommendations.length} personalized jobs and ${growth.length} growth opportunities`);
      } else {
        // Fallback to regular jobs if no profile
        Alert.alert(
          'Complete seu perfil',
          'Para receber recomendações personalizadas, complete suas informações de perfil e habilidades.',
          [
            { text: 'Mais tarde', style: 'cancel' },
            { text: 'Completar perfil', onPress: () => navigation.navigate('Profile') }
          ]
        );
        
        const regularJobs = await jobsService.searchJobs();
        const fallbackMatches = regularJobs.map(job => ({
          job,
          overallScore: 50,
          levelMatch: 50,
          skillMatch: 50,
          locationMatch: 50,
          salaryMatch: 50,
          techMatch: 50,
          requirementsMatch: 50,
          matchReasons: ['Complete seu perfil para análise detalhada'],
          missingSkills: [],
          recommendations: ['Complete seu perfil para recomendações personalizadas']
        }));
        setJobMatches(fallbackMatches);
      }
    } catch (error) {
      console.error('Error loading intelligent jobs:', error);
      Alert.alert('Erro', 'Erro ao carregar vagas personalizadas');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadIntelligentJobs();
    setRefreshing(false);
  }, []);

  const handleApplyJob = async (jobId: string) => {
    if (!user) {
      Alert.alert('Login necessário', 'Faça login para candidatar-se a vagas');
      return;
    }

    Alert.alert(
      'Candidatar-se à vaga',
      'Deseja se candidatar a esta vaga? Seu perfil será enviado para a empresa.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Candidatar-se',
          onPress: async () => {
            try {
              await jobsService.applyToJob(jobId, user.id);
              Alert.alert('Sucesso!', 'Candidatura enviada com sucesso!');
            } catch (error: any) {
              Alert.alert('Erro', 'Erro ao enviar candidatura');
            }
          },
        },
      ]
    );
  };

  const getScoreColor = (score: number): string => {
    if (score >= 80) return '#10b981'; // Green
    if (score >= 60) return '#f59e0b'; // Yellow
    if (score >= 40) return '#f97316'; // Orange
    return '#ef4444'; // Red
  };

  const getScoreText = (score: number): string => {
    if (score >= 80) return 'Excelente';
    if (score >= 60) return 'Boa';
    if (score >= 40) return 'Moderada';
    return 'Baixa';
  };

  const renderJobCard = (matchData: JobMatchScore, showGrowthBadge = false) => {
    const { job, overallScore, matchReasons, missingSkills } = matchData;

    return (
      <TouchableOpacity
        key={job.id}
        style={styles.jobCard}
        onPress={() => navigation.navigate('JobDetail', { jobId: job.id })}
        activeOpacity={0.8}
      >
        {/* Match Score Badge */}
        <View style={[styles.scoreBadge, { backgroundColor: getScoreColor(overallScore) }]}>
          <Text style={styles.scoreText}>{overallScore}%</Text>
          <Text style={styles.scoreLabel}>{getScoreText(overallScore)}</Text>
        </View>

        {/* Growth Badge */}
        {showGrowthBadge && (
          <View style={styles.growthBadge}>
            <Ionicons name="trending-up" size={12} color="white" />
            <Text style={styles.growthBadgeText}>Crescimento</Text>
          </View>
        )}

        <View style={styles.jobHeader}>
          <Text style={styles.jobTitle} numberOfLines={2}>
            {job.title}
          </Text>
          <View style={[styles.levelBadge, { backgroundColor: getLevelColor(job.level) }]}>
            <Text style={styles.levelText}>{job.level}</Text>
          </View>
        </View>

        <Text style={styles.jobCompany}>{job.company}</Text>
        <Text style={styles.jobLocation}>{job.location}</Text>

        {job.salary_range && (
          <Text style={styles.jobSalary}>{job.salary_range}</Text>
        )}

        {/* Technologies */}
        <View style={styles.techContainer}>
          {job.technologies.slice(0, 3).map((tech, index) => (
            <View key={index} style={styles.techTag}>
              <Text style={styles.techText}>{tech}</Text>
            </View>
          ))}
          {job.technologies.length > 3 && (
            <Text style={styles.moreTech}>+{job.technologies.length - 3}</Text>
          )}
        </View>

        {/* Match Reasons */}
        {matchReasons.length > 0 && (
          <View style={styles.matchReasonsContainer}>
            <Text style={styles.matchReasonsTitle}>Por que é uma boa opção:</Text>
            {matchReasons.slice(0, 2).map((reason, index) => (
              <View key={index} style={styles.matchReason}>
                <Ionicons name="checkmark-circle" size={12} color="#10b981" />
                <Text style={styles.matchReasonText}>{reason}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Missing Skills */}
        {missingSkills.length > 0 && (
          <View style={styles.missingSkillsContainer}>
            <Text style={styles.missingSkillsTitle}>Skills para desenvolver:</Text>
            <Text style={styles.missingSkillsText}>
              {missingSkills.slice(0, 2).join(', ')}
            </Text>
          </View>
        )}

        <View style={styles.jobFooter}>
          <View style={styles.jobStats}>
            <Ionicons name="people-outline" size={14} color="#6b7280" />
            <Text style={styles.jobStatsText}>{job.applications_count} candidatos</Text>
          </View>

          <TouchableOpacity
            style={[styles.applyButton, { backgroundColor: getScoreColor(overallScore) }]}
            onPress={() => handleApplyJob(job.id)}
          >
            <Text style={styles.applyButtonText}>Candidatar-se</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const renderModeSelector = () => (
    <View style={styles.modeSelector}>
      <TouchableOpacity
        style={[styles.modeButton, searchMode === 'personalized' && styles.modeButtonActive]}
        onPress={() => setSearchMode('personalized')}
      >
        <Ionicons 
          name="person-outline" 
          size={16} 
          color={searchMode === 'personalized' ? 'white' : '#6b7280'} 
        />
        <Text style={[
          styles.modeButtonText,
          searchMode === 'personalized' && styles.modeButtonTextActive
        ]}>
          Para Você
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.modeButton, searchMode === 'growth' && styles.modeButtonActive]}
        onPress={() => setSearchMode('growth')}
      >
        <Ionicons 
          name="trending-up-outline" 
          size={16} 
          color={searchMode === 'growth' ? 'white' : '#6b7280'} 
        />
        <Text style={[
          styles.modeButtonText,
          searchMode === 'growth' && styles.modeButtonTextActive
        ]}>
          Crescimento
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.modeButton, searchMode === 'all' && styles.modeButtonActive]}
        onPress={() => setSearchMode('all')}
      >
        <Ionicons 
          name="grid-outline" 
          size={16} 
          color={searchMode === 'all' ? 'white' : '#6b7280'} 
        />
        <Text style={[
          styles.modeButtonText,
          searchMode === 'all' && styles.modeButtonTextActive
        ]}>
          Todas
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderUserAnalysis = () => {
    if (!userAnalysis) return null;

    return (
      <Modal
        visible={showAnalysis}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowAnalysis(false)}
      >
        <SafeAreaView style={styles.analysisModal}>
          <View style={styles.analysisHeader}>
            <TouchableOpacity onPress={() => setShowAnalysis(false)}>
              <Ionicons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
            <Text style={styles.analysisTitle}>Análise do seu Perfil</Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView style={styles.analysisContent}>
            <View style={styles.analysisCard}>
              <Text style={styles.analysisCardTitle}>Nível de Experiência</Text>
              <Text style={styles.analysisCardValue}>{userAnalysis.experienceLevel}</Text>
            </View>

            <View style={styles.analysisCard}>
              <Text style={styles.analysisCardTitle}>Foco da Carreira</Text>
              <Text style={styles.analysisCardValue}>{userAnalysis.careerFocus}</Text>
            </View>

            <View style={styles.analysisCard}>
              <Text style={styles.analysisCardTitle}>Principais Tecnologias</Text>
              <View style={styles.techGrid}>
                {userAnalysis.primaryTechnologies.map((tech, index) => (
                  <View key={index} style={styles.primaryTechTag}>
                    <Text style={styles.primaryTechText}>{tech}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.analysisCard}>
              <Text style={styles.analysisCardTitle}>Faixa Salarial Estimada</Text>
              <Text style={styles.analysisCardValue}>
                R$ {userAnalysis.salaryRange.min.toLocaleString()} - R$ {userAnalysis.salaryRange.max.toLocaleString()}
              </Text>
            </View>

            <View style={styles.analysisCard}>
              <Text style={styles.analysisCardTitle}>Score Geral de Skills</Text>
              <View style={styles.scoreBarContainer}>
                <View style={styles.scoreBar}>
                  <View 
                    style={[
                      styles.scoreBarFill, 
                      { 
                        width: `${userAnalysis.skillMatchingScore}%`,
                        backgroundColor: getScoreColor(userAnalysis.skillMatchingScore)
                      }
                    ]} 
                  />
                </View>
                <Text style={styles.scoreBarText}>{userAnalysis.skillMatchingScore}/100</Text>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    );
  };

  const getLevelColor = (level: string): string => {
    const colors: Record<string, string> = {
      'junior': '#3b82f6',
      'pleno': '#f59e0b',
      'senior': '#10b981',
      'lead': '#8b5cf6'
    };
    return colors[level] || '#6b7280';
  };

  const getJobsToShow = (): JobMatchScore[] => {
    switch (searchMode) {
      case 'personalized':
        return jobMatches;
      case 'growth':
        return growthOpportunities;
      case 'all':
        return [...jobMatches, ...growthOpportunities];
      default:
        return jobMatches;
    }
  };

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.container}>
        <UniversalHeader 
          title="Vagas Inteligentes"
          onBackPress={() => navigation.goBack()}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text style={styles.loadingText}>Analisando seu perfil...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <UniversalHeader 
        title="Vagas Inteligentes"
        onBackPress={() => navigation.goBack()}
        rightComponent={
          userAnalysis ? (
            <TouchableOpacity onPress={() => setShowAnalysis(true)}>
              <Ionicons name="analytics-outline" size={24} color="#1f2937" />
            </TouchableOpacity>
          ) : undefined
        }
      />

      <ScrollView
        style={styles.scrollContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        {/* User Analysis Summary */}
        {userAnalysis && (
          <LinearGradient colors={['#3b82f6', '#8b5cf6']} style={styles.profileSummary}>
            <Text style={styles.profileSummaryTitle}>
              Perfil: {userAnalysis.experienceLevel} em {userAnalysis.careerFocus}
            </Text>
            <Text style={styles.profileSummaryText}>
              {userAnalysis.primaryTechnologies.slice(0, 3).join(' • ')}
            </Text>
            <TouchableOpacity 
              style={styles.viewAnalysisButton}
              onPress={() => setShowAnalysis(true)}
            >
              <Text style={styles.viewAnalysisText}>Ver análise completa</Text>
              <Ionicons name="chevron-forward" size={16} color="white" />
            </TouchableOpacity>
          </LinearGradient>
        )}

        {renderModeSelector()}

        {/* Jobs List */}
        <View style={styles.jobsList}>
          {getJobsToShow().map((matchData) => 
            renderJobCard(matchData, searchMode === 'growth' || searchMode === 'all')
          )}
        </View>

        {getJobsToShow().length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="briefcase-outline" size={48} color="#9ca3af" />
            <Text style={styles.emptyTitle}>Nenhuma vaga encontrada</Text>
            <Text style={styles.emptyText}>
              Complete seu perfil para receber recomendações personalizadas
            </Text>
          </View>
        )}
      </ScrollView>

      {renderUserAnalysis()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
  },
  scrollContainer: {
    flex: 1,
  },
  profileSummary: {
    margin: 16,
    padding: 20,
    borderRadius: 16,
  },
  profileSummaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  profileSummaryText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 12,
  },
  viewAnalysisButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewAnalysisText: {
    fontSize: 14,
    color: 'white',
    fontWeight: '600',
  },
  modeSelector: {
    flexDirection: 'row',
    margin: 16,
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    padding: 4,
  },
  modeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    gap: 6,
    borderRadius: 8,
  },
  modeButtonActive: {
    backgroundColor: '#3b82f6',
  },
  modeButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  modeButtonTextActive: {
    color: 'white',
  },
  jobsList: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  jobCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    position: 'relative',
  },
  scoreBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 60,
  },
  scoreText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },
  scoreLabel: {
    fontSize: 10,
    color: 'white',
  },
  growthBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f59e0b',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 2,
  },
  growthBadgeText: {
    fontSize: 10,
    color: 'white',
    fontWeight: '600',
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
    marginTop: 8,
    paddingRight: 70,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    flex: 1,
    marginRight: 8,
  },
  levelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  levelText: {
    fontSize: 11,
    color: 'white',
    fontWeight: '600',
  },
  jobCompany: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '600',
    marginBottom: 4,
  },
  jobLocation: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  jobSalary: {
    fontSize: 14,
    color: '#059669',
    fontWeight: '600',
    marginBottom: 12,
  },
  techContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
    alignItems: 'center',
  },
  techTag: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  techText: {
    fontSize: 11,
    color: '#3b82f6',
    fontWeight: '500',
  },
  moreTech: {
    fontSize: 11,
    color: '#9ca3af',
    fontWeight: '500',
  },
  matchReasonsContainer: {
    marginBottom: 12,
  },
  matchReasonsTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  matchReason: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  matchReasonText: {
    fontSize: 11,
    color: '#6b7280',
    flex: 1,
  },
  missingSkillsContainer: {
    marginBottom: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  missingSkillsTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#f97316',
    marginBottom: 4,
  },
  missingSkillsText: {
    fontSize: 11,
    color: '#f97316',
  },
  jobFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  jobStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  jobStatsText: {
    fontSize: 12,
    color: '#6b7280',
  },
  applyButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  applyButtonText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  analysisModal: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  analysisHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  analysisTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  analysisContent: {
    flex: 1,
    padding: 16,
  },
  analysisCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  analysisCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  analysisCardValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    textTransform: 'capitalize',
  },
  techGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  primaryTechTag: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  primaryTechText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '600',
  },
  scoreBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  scoreBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
  },
  scoreBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  scoreBarText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
});