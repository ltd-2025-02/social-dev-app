import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../contexts/ThemeContext';
import UniversalHeader from '../../components/UniversalHeader';
import { CareerPath, UserCareerProfile, CareerAnalytics } from '../../types/career.types';
import { CareerService } from '../../services/career.service';

interface CareerScreenProps {
  navigation: any;
}

export default function CareerScreenEnhanced({ navigation }: CareerScreenProps) {
  const { colors } = useTheme();
  const [careerPaths, setCareerPaths] = useState<CareerPath[]>([]);
  const [userProfile, setUserProfile] = useState<UserCareerProfile | null>(null);
  const [analytics, setAnalytics] = useState<CareerAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const careerService = new CareerService();

  useEffect(() => {
    loadCareerData();
  }, []);

  const loadCareerData = async () => {
    try {
      const [pathsData, profileData, analyticsData] = await Promise.all([
        careerService.getCareerPaths(),
        careerService.getUserCareerProfile('user-id'), // Replace with actual user ID
        careerService.getUserCareerAnalytics('user-id')
      ]);
      
      setCareerPaths(pathsData);
      setUserProfile(profileData);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Error loading career data:', error);
      // Fallback to static data
      setCareerPaths(staticCareerPaths);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadCareerData();
  };

  const staticCareerPaths = [
    {
      id: '1',
      title: 'Frontend Developer',
      description: 'React, Vue, Angular, HTML/CSS',
      category: 'development' as const,
      experienceLevel: 'junior' as const,
      averageSalary: { min: 4000, max: 12000, currency: 'BRL', location: 'Brasil' },
      marketDemand: 5,
      growthProjection: 15.5,
      color: ['#3b82f6', '#1d4ed8'],
      icon: 'desktop-outline',
      workStyle: 'remote' as const,
      requiredSkills: [],
      optionalSkills: [],
      roadmap: [],
      jobTitles: [],
      companies: [],
      tags: []
    },
    {
      id: '2',
      title: 'Backend Developer',
      description: 'Node.js, Python, Java, APIs',
      category: 'development' as const,
      experienceLevel: 'junior' as const,
      averageSalary: { min: 5000, max: 15000, currency: 'BRL', location: 'Brasil' },
      marketDemand: 5,
      growthProjection: 18.0,
      color: ['#10b981', '#059669'],
      icon: 'server-outline',
      workStyle: 'remote' as const,
      requiredSkills: [],
      optionalSkills: [],
      roadmap: [],
      jobTitles: [],
      companies: [],
      tags: []
    },
    {
      id: '3',
      title: 'Mobile Developer',
      description: 'React Native, Flutter, iOS, Android',
      category: 'development' as const,
      experienceLevel: 'junior' as const,
      averageSalary: { min: 4500, max: 13000, currency: 'BRL', location: 'Brasil' },
      marketDemand: 4,
      growthProjection: 20.0,
      color: ['#f59e0b', '#d97706'],
      icon: 'phone-portrait-outline',
      workStyle: 'remote' as const,
      requiredSkills: [],
      optionalSkills: [],
      roadmap: [],
      jobTitles: [],
      companies: [],
      tags: []
    },
    {
      id: '4',
      title: 'DevOps Engineer',
      description: 'AWS, Docker, Kubernetes, CI/CD',
      category: 'devops' as const,
      experienceLevel: 'mid' as const,
      averageSalary: { min: 7000, max: 18000, currency: 'BRL', location: 'Brasil' },
      marketDemand: 5,
      growthProjection: 25.0,
      color: ['#8b5cf6', '#7c3aed'],
      icon: 'cloud-outline',
      workStyle: 'hybrid' as const,
      requiredSkills: [],
      optionalSkills: [],
      roadmap: [],
      jobTitles: [],
      companies: [],
      tags: []
    },
    {
      id: '5',
      title: 'Data Scientist',
      description: 'Python, Machine Learning, Analytics',
      category: 'data' as const,
      experienceLevel: 'junior' as const,
      averageSalary: { min: 6000, max: 16000, currency: 'BRL', location: 'Brasil' },
      marketDemand: 5,
      growthProjection: 22.0,
      color: ['#ef4444', '#dc2626'],
      icon: 'analytics-outline',
      workStyle: 'remote' as const,
      requiredSkills: [],
      optionalSkills: [],
      roadmap: [],
      jobTitles: [],
      companies: [],
      tags: []
    },
    {
      id: '6',
      title: 'Tech Lead',
      description: 'Leadership, Architecture, Strategy',
      category: 'management' as const,
      experienceLevel: 'senior' as const,
      averageSalary: { min: 12000, max: 25000, currency: 'BRL', location: 'Brasil' },
      marketDemand: 4,
      growthProjection: 12.0,
      color: ['#6366f1', '#4f46e5'],
      icon: 'people-outline',
      workStyle: 'hybrid' as const,
      requiredSkills: [],
      optionalSkills: [],
      roadmap: [],
      jobTitles: [],
      companies: [],
      tags: []
    },
  ];

  const getSkillsData = () => {
    if (analytics?.skillGrowth) {
      return analytics.skillGrowth.slice(0, 5).map(skill => ({
        name: skill.skillName,
        progress: skill.history[skill.history.length - 1]?.level * 25 || 0,
        color: '#' + Math.floor(Math.random()*16777215).toString(16), // Random color
      }));
    }
    
    // Fallback static data
    return [
      { name: 'JavaScript', progress: 85, color: '#f7df1e' },
      { name: 'React', progress: 75, color: '#61dafb' },
      { name: 'Node.js', progress: 70, color: '#8cc84b' },
      { name: 'Python', progress: 60, color: '#3776ab' },
      { name: 'TypeScript', progress: 65, color: '#3178c6' },
    ];
  };

  const skills = getSkillsData();

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <UniversalHeader title="Carreira" showBackButton={true} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textMuted }]}>
            Carregando dados da carreira...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <UniversalHeader title="Carreira" showBackButton={true} />

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        {/* Career Dashboard Access */}
        <TouchableOpacity 
          style={[styles.dashboardCard, { backgroundColor: colors.primary }]}
          onPress={() => navigation.navigate('CareerDashboard')}
        >
          <LinearGradient
            colors={[colors.primary, colors.primary + '80']}
            style={styles.dashboardGradient}
          >
            <View style={styles.dashboardIcon}>
              <Ionicons name="analytics-outline" size={28} color="#fff" />
            </View>
            <View style={styles.dashboardInfo}>
              <Text style={styles.dashboardTitle}>Dashboard Completo</Text>
              <Text style={styles.dashboardSubtitle}>
                Analytics avançados e insights profissionais
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="rgba(255,255,255,0.8)" />
          </LinearGradient>
        </TouchableOpacity>

        {/* Progress Overview */}
        <View style={[styles.progressCard, { backgroundColor: colors.surface }]}>
          <View style={styles.progressHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Seu Progresso</Text>
            {analytics && (
              <TouchableOpacity onPress={() => navigation.navigate('SkillsAnalytics')}>
                <Text style={[styles.seeAllText, { color: colors.primary }]}>Ver detalhes</Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.skillsList}>
            {skills.map((skill, index) => (
              <View key={index} style={styles.skillItem}>
                <View style={styles.skillHeader}>
                  <Text style={[styles.skillName, { color: colors.text }]}>{skill.name}</Text>
                  <Text style={[styles.skillPercentage, { color: colors.textMuted }]}>{Math.round(skill.progress)}%</Text>
                </View>
                <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
                  <View 
                    style={[
                      styles.progressFill,
                      { 
                        width: `${skill.progress}%`,
                        backgroundColor: skill.color,
                      }
                    ]} 
                  />
                </View>
              </View>
            ))}
          </View>
          
          {/* Overall Progress */}
          {analytics && (
            <View style={styles.overallProgressContainer}>
              <Text style={[styles.overallProgressTitle, { color: colors.text }]}>
                Progresso Geral da Carreira
              </Text>
              <View style={[styles.overallProgressBar, { backgroundColor: colors.border }]}>
                <View 
                  style={[
                    styles.overallProgressFill,
                    { 
                      width: `${analytics.careerProgress.overallProgress}%`,
                      backgroundColor: colors.primary,
                    }
                  ]} 
                />
              </View>
              <Text style={[styles.overallProgressText, { color: colors.textMuted }]}>
                {analytics.careerProgress.overallProgress}% completo • {analytics.careerProgress.milestonesCompleted}/{analytics.careerProgress.totalMilestones} marcos atingidos
              </Text>
            </View>
          )}
        </View>

        {/* Career Paths */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Trilhas de Carreira</Text>
              <Text style={[styles.sectionSubtitle, { color: colors.textMuted }]}>
                Explore diferentes caminhos na tecnologia
              </Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('CareerPaths')}>
              <Text style={[styles.seeAllText, { color: colors.primary }]}>Ver todas</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.careerGrid}>
            {careerPaths.slice(0, 4).map((career, index) => {
              const isCurrentPath = userProfile?.currentPath === career.id;
              const colors_array = Array.isArray(career.color) ? career.color : ['#3b82f6', '#1d4ed8'];
              
              return (
                <TouchableOpacity 
                  key={career.id || index} 
                  style={styles.careerCard}
                  onPress={() => navigation.navigate('CareerPathDetail', { pathId: career.id || `path-${index}` })}
                >
                  <LinearGradient
                    colors={colors_array}
                    style={styles.careerGradient}
                  >
                    {isCurrentPath && (
                      <View style={styles.currentPathBadge}>
                        <Text style={styles.currentPathBadgeText}>Atual</Text>
                      </View>
                    )}
                    <View style={styles.careerIcon}>
                      <Ionicons name={career.icon as any} size={24} color="#fff" />
                    </View>
                    <View style={styles.careerInfo}>
                      <Text style={styles.careerTitle}>{career.title}</Text>
                      <Text style={styles.careerDescription}>
                        {career.description || `${career.title} • ${career.experienceLevel}`}
                      </Text>
                      {career.averageSalary && (
                        <Text style={styles.careerSalary}>
                          R$ {career.averageSalary.min?.toLocaleString()} - R$ {career.averageSalary.max?.toLocaleString()}
                        </Text>
                      )}
                      <View style={styles.careerMeta}>
                        <View style={styles.careerMetaItem}>
                          <Ionicons name="trending-up" size={12} color="rgba(255,255,255,0.8)" />
                          <Text style={styles.careerMetaText}>
                            +{career.growthProjection || '15'}%
                          </Text>
                        </View>
                        <View style={styles.careerMetaItem}>
                          <Ionicons name="location" size={12} color="rgba(255,255,255,0.8)" />
                          <Text style={styles.careerMetaText}>
                            {career.workStyle || 'Remote'}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.8)" />
                  </LinearGradient>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Ações Rápidas</Text>
          
          <View style={styles.actionsGrid}>
            <TouchableOpacity 
              style={[styles.actionCard, { backgroundColor: colors.background, borderColor: colors.border }]}
              onPress={() => navigation.navigate('ResumeSelection')}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#ddd6fe' }]}>
                <Ionicons name="document-text-outline" size={24} color="#8b5cf6" />
              </View>
              <Text style={[styles.actionTitle, { color: colors.text }]}>Criar Currículo</Text>
              <Text style={[styles.actionSubtitle, { color: colors.textMuted }]}>Template profissional</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.actionCard, { backgroundColor: colors.background, borderColor: colors.border }]}
              onPress={() => navigation.navigate('SkillAssessment')}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#e0f2fe' }]}>
                <Ionicons name="checkmark-circle-outline" size={24} color="#0ea5e9" />
              </View>
              <Text style={[styles.actionTitle, { color: colors.text }]}>Avaliar Skills</Text>
              <Text style={[styles.actionSubtitle, { color: colors.textMuted }]}>Teste seus conhecimentos</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.actionCard, { backgroundColor: colors.background, borderColor: colors.border }]}
              onPress={() => navigation.navigate('JobSearch')}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#dcfce7' }]}>
                <Ionicons name="search-outline" size={24} color="#16a34a" />
              </View>
              <Text style={[styles.actionTitle, { color: colors.text }]}>Buscar Vagas</Text>
              <Text style={[styles.actionSubtitle, { color: colors.textMuted }]}>Oportunidades</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.actionCard, { backgroundColor: colors.background, borderColor: colors.border }]}
              onPress={() => navigation.navigate('Certifications')}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#fef3c7' }]}>
                <Ionicons name="school-outline" size={24} color="#d97706" />
              </View>
              <Text style={[styles.actionTitle, { color: colors.text }]}>Certificações</Text>
              <Text style={[styles.actionSubtitle, { color: colors.textMuted }]}>Validar skills</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.actionCard, { backgroundColor: colors.background, borderColor: colors.border }]}
              onPress={() => navigation.navigate('Mentors')}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#fce7f3' }]}>
                <Ionicons name="people-outline" size={24} color="#ec4899" />
              </View>
              <Text style={[styles.actionTitle, { color: colors.text }]}>Mentoria</Text>
              <Text style={[styles.actionSubtitle, { color: colors.textMuted }]}>Encontrar mentor</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.actionCard, { backgroundColor: colors.background, borderColor: colors.border }]}
              onPress={() => navigation.navigate('Hire')}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#ccfbf1' }]}>
                <Ionicons name="briefcase-outline" size={24} color="#14b8a6" />
              </View>
              <Text style={[styles.actionTitle, { color: colors.text }]}>Contrate</Text>
              <Text style={[styles.actionSubtitle, { color: colors.textMuted }]}>Ofereça serviços</Text>
            </TouchableOpacity>
          </View>
        </View>
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
  },
  dashboardCard: {
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  dashboardGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  dashboardIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  dashboardInfo: {
    flex: 1,
  },
  dashboardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  dashboardSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 20,
  },
  progressCard: {
    margin: 16,
    marginTop: 0,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
  skillsList: {
    marginTop: 16,
  },
  skillItem: {
    marginBottom: 16,
  },
  skillHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  skillName: {
    fontSize: 14,
    fontWeight: '600',
  },
  skillPercentage: {
    fontSize: 12,
    fontWeight: '500',
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  overallProgressContainer: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  overallProgressTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  overallProgressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  overallProgressFill: {
    height: '100%',
    borderRadius: 4,
  },
  overallProgressText: {
    fontSize: 12,
    textAlign: 'center',
  },
  section: {
    margin: 16,
    marginTop: 0,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  sectionSubtitle: {
    fontSize: 14,
    marginBottom: 16,
  },
  careerGrid: {
    gap: 12,
  },
  careerCard: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  careerGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    position: 'relative',
  },
  currentPathBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  currentPathBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#000',
  },
  careerIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  careerInfo: {
    flex: 1,
  },
  careerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  careerDescription: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 8,
  },
  careerSalary: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
    marginBottom: 8,
  },
  careerMeta: {
    flexDirection: 'row',
    gap: 12,
  },
  careerMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  careerMetaText: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    minWidth: 140,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  actionSubtitle: {
    fontSize: 12,
    textAlign: 'center',
  },
});