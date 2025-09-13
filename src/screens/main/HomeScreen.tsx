import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { fetchFeaturedJobs } from '../../store/slices/jobsSlice';
import { fetchUserStats, fetchGlobalStats, fetchRecentActivity } from '../../store/slices/statsSlice';
import { useNotifications } from '../../hooks/useNotifications';
import NotificationBadge from '../../components/NotificationBadge';
import { useTheme } from '../../contexts/ThemeContext';
import { resumeDraftService } from '../../services/resumeDraft.service';
import NewsBanner from '../../components/NewsBanner';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }: any) {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { featuredJobs } = useSelector((state: RootState) => state.jobs);
  const { userStats, globalStats, recentActivity, loading } = useSelector((state: RootState) => state.stats);
  const { colors } = useTheme();
  
  const [refreshing, setRefreshing] = useState(false);
  const [resumeDraftStats, setResumeDraftStats] = useState<any>(null);

  // Configurar notificações em tempo real
  useNotifications(user?.id);

  const loadData = async () => {
    if (user?.id) {
      await Promise.all([
        dispatch(fetchFeaturedJobs()),
        dispatch(fetchUserStats(user.id)),
        dispatch(fetchGlobalStats()),
        dispatch(fetchRecentActivity(user.id))
      ]);
      
      // Check for resume draft
      const draftStats = await resumeDraftService.getDraftStats(user.id);
      setResumeDraftStats(draftStats);
    }
  };

  useEffect(() => {
    loadData();
  }, [dispatch, user?.id]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const quickActions = [
    {
      icon: 'newspaper-outline',
      title: 'Feed',
      subtitle: 'Ver posts',
      color: '#3b82f6',
      onPress: () => navigation.navigate('Feed'),
    },
    {
      icon: 'bookmark-outline',
      title: 'Vagas Salvas',
      subtitle: 'Vagas salvas',
      color: '#10b981',
      onPress: () => navigation.navigate('SavedJobs'),
    },
    {
      icon: 'people-outline',
      title: 'Usuários',
      subtitle: 'Buscar pessoas',
      color: '#e11d48',
      onPress: () => navigation.navigate('UserSearch'),
    },
    {
      icon: 'chatbubbles-outline',
      title: 'Chat',
      subtitle: 'Conversas',
      color: '#8b5cf6',
      onPress: () => navigation.navigate('Chat'),
    },
    {
      icon: 'person-outline',
      title: 'Perfil',
      subtitle: 'Meu perfil',
      color: '#f59e0b',
      onPress: () => navigation.navigate('Profile'),
    },
    {
      icon: 'document-text-outline',
      title: 'Meus Currículos',
      subtitle: 'Ver currículos',
      color: '#8b5cf6',
      onPress: () => navigation.navigate('MyResumes'),
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.headerBackground }]}>
          <View>
            <Text style={[styles.greeting, { color: colors.text }]}>Olá, {user?.name?.split(' ')[0]}! 👋</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Bem-vindo ao SocialDev</Text>
          </View>
          <View style={styles.headerButtons}>
            <TouchableOpacity 
              style={styles.notificationButton}
              onPress={() => navigation.navigate('Notifications')}
            >
              <Ionicons name="notifications-outline" size={24} color={colors.headerText} />
              <NotificationBadge />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.settingsButton}
              onPress={() => navigation.navigate('SettingsStack', { screen: 'Settings' })}
            >
              <Ionicons name="settings-outline" size={24} color={colors.headerText} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Resume Draft Banner */}
        {resumeDraftStats?.hasActiveDraft && (
          <View style={styles.section}>
            <TouchableOpacity
              style={[styles.resumeDraftBanner, { backgroundColor: '#f59e0b15' }]}
              onPress={() => navigation.navigate('ResumeBuilder')}
              activeOpacity={0.8}
            >
              <View style={styles.resumeDraftIcon}>
                <Ionicons name="document-text" size={28} color="#f59e0b" />
                <View style={styles.draftBadge}>
                  <Text style={styles.draftBadgeText}>{resumeDraftStats.progress}%</Text>
                </View>
              </View>
              
              <View style={styles.resumeDraftContent}>
                <Text style={[styles.resumeDraftTitle, { color: colors.text }]}>
                  📄 Currículo em Andamento
                </Text>
                <Text style={[styles.resumeDraftSubtitle, { color: colors.textMuted }]}>
                  {resumeDraftStats.currentStep} • {resumeDraftStats.timeElapsed}
                </Text>
                <Text style={[styles.resumeDraftAction, { color: '#f59e0b' }]}>
                  Toque para continuar →
                </Text>
              </View>
              
              <View style={styles.resumeDraftProgress}>
                <View style={[styles.progressBarBg, { backgroundColor: colors.border }]}>
                  <View 
                    style={[
                      styles.progressBarFill, 
                      { width: `${resumeDraftStats.progress}%`, backgroundColor: '#f59e0b' }
                    ]} 
                  />
                </View>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* User Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={[styles.statsCard, { backgroundColor: colors.surface }]}>
            {loading ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <>
                <Text style={[styles.statsNumber, { color: colors.text }]}>
                  {userStats?.followers || 0}
                </Text>
                <Text style={[styles.statsLabel, { color: colors.textMuted }]}>Seguidores</Text>
              </>
            )}
          </View>
          <View style={[styles.statsCard, { backgroundColor: colors.surface }]}>
            {loading ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <>
                <Text style={[styles.statsNumber, { color: colors.text }]}>
                  {userStats?.postsLikes || 0}
                </Text>
                <Text style={[styles.statsLabel, { color: colors.textMuted }]}>Curtidas</Text>
              </>
            )}
          </View>
          <View style={[styles.statsCard, { backgroundColor: colors.surface }]}>
            {loading ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <>
                <Text style={[styles.statsNumber, { color: colors.text }]}>
                  {userStats?.jobsFound || 0}
                </Text>
                <Text style={[styles.statsLabel, { color: colors.textMuted }]}>Vagas Encontradas</Text>
              </>
            )}
          </View>
        </View>

        {/* Global Stats Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Estatísticas da Plataforma</Text>
          <View style={styles.globalStatsContainer}>
            <View style={[styles.globalStatCard, { backgroundColor: colors.surface }]}>
              <Ionicons name="people" size={24} color="#3b82f6" />
              <Text style={[styles.globalStatNumber, { color: colors.text }]}>
                {loading ? '...' : `${globalStats?.totalUsers || 0}+`}
              </Text>
              <Text style={[styles.globalStatLabel, { color: colors.textMuted }]}>Desenvolvedores</Text>
            </View>
            <View style={[styles.globalStatCard, { backgroundColor: colors.surface }]}>
              <Ionicons name="newspaper" size={24} color="#10b981" />
              <Text style={[styles.globalStatNumber, { color: colors.text }]}>
                {loading ? '...' : `${globalStats?.totalPosts || 0}+`}
              </Text>
              <Text style={[styles.globalStatLabel, { color: colors.textMuted }]}>Posts</Text>
            </View>
            <View style={[styles.globalStatCard, { backgroundColor: colors.surface }]}>
              <Ionicons name="briefcase" size={24} color="#f59e0b" />
              <Text style={[styles.globalStatNumber, { color: colors.text }]}>
                {loading ? '...' : `${globalStats?.totalJobs || 0}+`}
              </Text>
              <Text style={[styles.globalStatLabel, { color: colors.textMuted }]}>Vagas</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acesso rápido</Text>
          <View style={styles.quickActions}>
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.actionCard, { backgroundColor: `${action.color}15` }]}
                onPress={action.onPress}
              >
                <View style={[styles.actionIcon, { backgroundColor: action.color }]}>
                  <Ionicons name={action.icon as any} size={24} color="white" />
                </View>
                <Text style={styles.actionTitle}>{action.title}</Text>
                <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Featured Jobs */}
        {featuredJobs.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Vagas em destaque</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Jobs')}>
                <Text style={styles.seeAllText}>Ver todas</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {featuredJobs.slice(0, 3).map((job) => (
                <TouchableOpacity
                  key={job.id}
                  style={styles.jobCard}
                  onPress={() => navigation.navigate('JobDetail', { jobId: job.id })}
                  activeOpacity={0.8}
                >
                  <View style={styles.jobHeader}>
                    <Text style={styles.jobTitle} numberOfLines={1}>
                      {job.title}
                    </Text>
                    <View style={[styles.jobType, 
                      { backgroundColor: job.type === 'remote' ? '#10b981' : '#3b82f6' }
                    ]}>
                      <Text style={styles.jobTypeText}>
                        {job.type === 'remote' ? 'Remoto' : 
                         job.type === 'hybrid' ? 'Híbrido' : 'Presencial'}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.jobCompany}>{job.company}</Text>
                  <Text style={styles.jobLocation}>{job.location}</Text>
                  {job.salary_range && (
                    <Text style={styles.jobSalary}>{job.salary_range}</Text>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* News Banner */}
        <NewsBanner navigation={navigation} />

        {/* Benefits Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Benefícios</Text>
          <Text style={[styles.sectionSubtitle, { color: colors.textMuted }]}>
            O apoio ao desenvolvedor
          </Text>
          
          <View style={styles.benefitsContainer}>
            <View style={[styles.benefitCard, { backgroundColor: colors.surface }]}>
              <Image 
                source={require('../../../assets/app.png')} 
                style={styles.benefitImage}
                resizeMode="cover"
              />
              <View style={styles.benefitContent}>
                <Text style={[styles.benefitTitle, { color: colors.text }]}>
                  Comunidade Ativa
                </Text>
                <Text style={[styles.benefitDescription, { color: colors.textMuted }]}>
                  Faça parte de uma comunidade vibrante de desenvolvedores, compartilhe conhecimento e cresça junto com profissionais de todo o Brasil.
                </Text>
                <TouchableOpacity 
                  style={[styles.benefitButton, { backgroundColor: colors.primary }]}
                  onPress={() => navigation.navigate('Feed')}
                >
                  <Text style={styles.benefitButtonText}>Participar</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={[styles.benefitCard, { backgroundColor: colors.surface }]}>
              <Image 
                source={require('../../../assets/screen-dev.png')} 
                style={styles.benefitImage}
                resizeMode="cover"
              />
              <View style={styles.benefitContent}>
                <Text style={[styles.benefitTitle, { color: colors.text }]}>
                  Oportunidades Exclusivas
                </Text>
                <Text style={[styles.benefitDescription, { color: colors.textMuted }]}>
                  Acesse vagas exclusivas de empresas parceiras, participe de processos seletivos diferenciados e acelere sua carreira.
                </Text>
                <TouchableOpacity 
                  style={[styles.benefitButton, { backgroundColor: colors.primary }]}
                  onPress={() => navigation.navigate('Jobs')}
                >
                  <Text style={styles.benefitButtonText}>Ver Vagas</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={[styles.benefitCard, { backgroundColor: colors.surface }]}>
              <Image 
                source={require('../../../assets/icone.png')} 
                style={styles.benefitImage}
                resizeMode="cover"
              />
              <View style={styles.benefitContent}>
                <Text style={[styles.benefitTitle, { color: colors.text }]}>
                  Desenvolvimento Contínuo
                </Text>
                <Text style={[styles.benefitDescription, { color: colors.textMuted }]}>
                  Acesse conteúdos educacionais, trilhas de aprendizado personalizadas e mantenha-se atualizado com as últimas tecnologias.
                </Text>
                <TouchableOpacity 
                  style={[styles.benefitButton, { backgroundColor: colors.primary }]}
                  onPress={() => navigation.navigate('Career')}
                >
                  <Text style={styles.benefitButtonText}>Aprender</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Recent Activity & Metrics */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Atividade recente</Text>
            <TouchableOpacity 
              style={styles.metricsButton}
              onPress={() => navigation.navigate('MetricsDashboard')}
            >
              <Ionicons name="analytics-outline" size={16} color="white" />
              <Text style={styles.metricsButtonText}>Métricas</Text>
            </TouchableOpacity>
          </View>
          
          {recentActivity && recentActivity.length > 0 ? (
            <View style={styles.recentPostsContainer}>
              {recentActivity.slice(0, 3).map((post, index) => (
                <TouchableOpacity
                  key={post.id || index}
                  style={styles.recentPostCard}
                  onPress={() => navigation.navigate('PostDetail', { postId: post.id })}
                >
                  <View style={styles.postHeader}>
                    <View style={styles.postIconContainer}>
                      <Ionicons name="document-text-outline" size={20} color="#3b82f6" />
                    </View>
                    <View style={styles.postContent}>
                      <Text style={styles.postText} numberOfLines={2}>
                        {post.content || post.title || 'Post sem conteúdo'}
                      </Text>
                      <View style={styles.postStats}>
                        <View style={styles.postStat}>
                          <Ionicons name="heart-outline" size={14} color="#ef4444" />
                          <Text style={styles.postStatText}>{post.likes || 0}</Text>
                        </View>
                        <View style={styles.postStat}>
                          <Ionicons name="chatbubble-outline" size={14} color="#6b7280" />
                          <Text style={styles.postStatText}>{post.comments || 0}</Text>
                        </View>
                        <View style={styles.postStat}>
                          <Ionicons name="eye-outline" size={14} color="#8b5cf6" />
                          <Text style={styles.postStatText}>{post.views || 0}</Text>
                        </View>
                      </View>
                      <Text style={styles.postTime}>
                        {post.created_at ? new Date(post.created_at).toLocaleDateString('pt-BR') : 'Hoje'}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
              
              <TouchableOpacity
                style={styles.viewAllPostsButton}
                onPress={() => navigation.navigate('Feed')}
              >
                <Text style={styles.viewAllPostsText}>Ver todos os posts</Text>
                <Ionicons name="arrow-forward" size={16} color="#3b82f6" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.activityCard}>
              <Ionicons name="document-text-outline" size={48} color="#94a3b8" />
              <Text style={styles.emptyStateTitle}>Nenhum post ainda</Text>
              <Text style={styles.emptyStateText}>
                Comece a compartilhar conteúdo para ver seus posts aqui
              </Text>
              <TouchableOpacity
                style={styles.emptyStateButton}
                onPress={() => navigation.navigate('Feed')}
                activeOpacity={0.8}
              >
                <Text style={styles.emptyStateButtonText}>Criar Post</Text>
              </TouchableOpacity>
            </View>
          )}
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
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 4,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 12,
  },
  statsCard: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    minHeight: 80,
    justifyContent: 'center',
  },
  statsNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  statsLabel: {
    fontSize: 11,
    color: '#6b7280',
    marginTop: 4,
    textAlign: 'center',
  },
  globalStatsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  globalStatCard: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  globalStatNumber: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 8,
    color: '#1f2937',
  },
  globalStatLabel: {
    fontSize: 10,
    color: '#6b7280',
    marginTop: 4,
    textAlign: 'center',
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  seeAllText: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '600',
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '48%',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    backgroundColor: 'white',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 12,
    color: '#6b7280',
  },
  jobCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginRight: 16,
    width: 250,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    flex: 1,
    marginRight: 8,
  },
  jobType: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  jobTypeText: {
    fontSize: 10,
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
    marginBottom: 8,
  },
  jobSalary: {
    fontSize: 14,
    color: '#059669',
    fontWeight: '600',
  },
  activityCard: {
    backgroundColor: 'white',
    padding: 32,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  emptyStateButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyStateButtonText: {
    fontSize: 14,
    color: 'white',
    fontWeight: '600',
  },
  metricsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3b82f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  metricsButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  recentPostsContainer: {
    gap: 12,
  },
  recentPostCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  postIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  postContent: {
    flex: 1,
  },
  postText: {
    fontSize: 14,
    color: '#1f2937',
    lineHeight: 20,
    marginBottom: 8,
  },
  postStats: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 4,
  },
  postStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  postStatText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  postTime: {
    fontSize: 11,
    color: '#9ca3af',
  },
  viewAllPostsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 8,
    gap: 6,
  },
  viewAllPostsText: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '600',
  },
  // Resume Draft Banner Styles
  resumeDraftBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  resumeDraftIcon: {
    position: 'relative',
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  draftBadge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: '#f59e0b',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  draftBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  resumeDraftContent: {
    flex: 1,
    marginRight: 12,
  },
  resumeDraftTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  resumeDraftSubtitle: {
    fontSize: 13,
    marginBottom: 6,
  },
  resumeDraftAction: {
    fontSize: 13,
    fontWeight: '500',
  },
  resumeDraftProgress: {
    width: 60,
    alignItems: 'center',
  },
  progressBarBg: {
    width: '100%',
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  sectionSubtitle: {
    fontSize: 16,
    marginTop: 4,
    marginBottom: 20,
  },
  benefitsContainer: {
    gap: 16,
  },
  benefitCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  benefitImage: {
    width: '100%',
    height: 200,
  },
  benefitContent: {
    padding: 20,
  },
  benefitTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  benefitDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  benefitButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  benefitButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});