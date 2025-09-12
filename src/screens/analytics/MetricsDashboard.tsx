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
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const { width } = Dimensions.get('window');

interface MetricsDashboardProps {
  navigation: any;
}

interface PostMetrics {
  id: string;
  content: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  reach: number;
  engagement_rate: number;
  created_at: string;
}

interface WeeklyStats {
  followers_growth: number;
  jobs_applied: number;
  total_applications: number;
  profile_views: number;
  post_impressions: number;
  engagement_rate: number;
}

export default function MetricsDashboard({ navigation }: MetricsDashboardProps) {
  const { user } = useSelector((state: RootState) => state.auth);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('week');

  // Dados simulados - substituir pela API real
  const [postMetrics] = useState<PostMetrics[]>([
    {
      id: '1',
      content: 'Acabei de finalizar um projeto incrível usando React Native...',
      views: 1247,
      likes: 89,
      comments: 23,
      shares: 12,
      reach: 985,
      engagement_rate: 12.8,
      created_at: '2024-09-10T10:30:00Z',
    },
    {
      id: '2',
      content: 'Dicas de como otimizar performance em aplicações móveis...',
      views: 2156,
      likes: 156,
      comments: 41,
      shares: 28,
      reach: 1823,
      engagement_rate: 15.2,
      created_at: '2024-09-08T14:20:00Z',
    },
    {
      id: '3',
      content: 'Compartilhando minha experiência na migração para TypeScript...',
      views: 896,
      likes: 67,
      comments: 18,
      shares: 8,
      reach: 743,
      engagement_rate: 11.4,
      created_at: '2024-09-06T09:15:00Z',
    },
  ]);

  const [weeklyStats] = useState<WeeklyStats>({
    followers_growth: 12.5,
    jobs_applied: 8,
    total_applications: 35,
    profile_views: 342,
    post_impressions: 4299,
    engagement_rate: 13.1,
  });

  const loadMetrics = async () => {
    setLoading(true);
    // Aqui você implementaria a chamada para a API
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    loadMetrics();
  }, [selectedPeriod]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadMetrics();
    setRefreshing(false);
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const periodOptions = [
    { key: 'week', label: 'Semana' },
    { key: 'month', label: 'Mês' },
    { key: 'year', label: 'Ano' },
  ];

  const renderHeader = () => (
    <LinearGradient colors={['#3b82f6', '#8b5cf6']} style={styles.header}>
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>
      
      <View style={styles.headerContent}>
        <Text style={styles.headerTitle}>Métricas & Analytics</Text>
        <Text style={styles.headerSubtitle}>Dashboard Profissional</Text>
      </View>

      <TouchableOpacity style={styles.exportButton}>
        <Ionicons name="download-outline" size={24} color="white" />
      </TouchableOpacity>
    </LinearGradient>
  );

  const renderPeriodSelector = () => (
    <View style={styles.periodSelector}>
      {periodOptions.map((option) => (
        <TouchableOpacity
          key={option.key}
          style={[
            styles.periodButton,
            selectedPeriod === option.key && styles.periodButtonActive,
          ]}
          onPress={() => setSelectedPeriod(option.key as any)}
        >
          <Text
            style={[
              styles.periodButtonText,
              selectedPeriod === option.key && styles.periodButtonTextActive,
            ]}
          >
            {option.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderOverviewStats = () => (
    <View style={styles.overviewContainer}>
      <Text style={styles.sectionTitle}>Visão Geral da Semana</Text>
      
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <LinearGradient colors={['#10b981', '#059669']} style={styles.statIcon}>
            <Ionicons name="trending-up" size={20} color="white" />
          </LinearGradient>
          <Text style={styles.statValue}>+{weeklyStats.followers_growth}%</Text>
          <Text style={styles.statLabel}>Crescimento</Text>
          <Text style={styles.statSubLabel}>Seguidores</Text>
        </View>

        <View style={styles.statCard}>
          <LinearGradient colors={['#3b82f6', '#2563eb']} style={styles.statIcon}>
            <Ionicons name="briefcase" size={20} color="white" />
          </LinearGradient>
          <Text style={styles.statValue}>{weeklyStats.jobs_applied}</Text>
          <Text style={styles.statLabel}>Vagas</Text>
          <Text style={styles.statSubLabel}>Aplicadas</Text>
        </View>

        <View style={styles.statCard}>
          <LinearGradient colors={['#8b5cf6', '#7c3aed']} style={styles.statIcon}>
            <Ionicons name="eye" size={20} color="white" />
          </LinearGradient>
          <Text style={styles.statValue}>{formatNumber(weeklyStats.profile_views)}</Text>
          <Text style={styles.statLabel}>Visualizações</Text>
          <Text style={styles.statSubLabel}>Perfil</Text>
        </View>

        <View style={styles.statCard}>
          <LinearGradient colors={['#f59e0b', '#d97706']} style={styles.statIcon}>
            <Ionicons name="heart" size={20} color="white" />
          </LinearGradient>
          <Text style={styles.statValue}>{weeklyStats.engagement_rate}%</Text>
          <Text style={styles.statLabel}>Engajamento</Text>
          <Text style={styles.statSubLabel}>Médio</Text>
        </View>
      </View>
    </View>
  );

  const renderPostMetrics = () => (
    <View style={styles.postsContainer}>
      <Text style={styles.sectionTitle}>Performance dos Posts</Text>
      
      {postMetrics.map((post) => (
        <View key={post.id} style={styles.postMetricCard}>
          <Text style={styles.postContent} numberOfLines={2}>
            {post.content}
          </Text>
          
          <View style={styles.postMetricsGrid}>
            <View style={styles.postMetricItem}>
              <View style={styles.postMetricHeader}>
                <Ionicons name="eye-outline" size={16} color="#6b7280" />
                <Text style={styles.postMetricLabel}>Alcance</Text>
              </View>
              <Text style={styles.postMetricValue}>{formatNumber(post.reach)}</Text>
            </View>
            
            <View style={styles.postMetricItem}>
              <View style={styles.postMetricHeader}>
                <Ionicons name="heart-outline" size={16} color="#ef4444" />
                <Text style={styles.postMetricLabel}>Curtidas</Text>
              </View>
              <Text style={styles.postMetricValue}>{post.likes}</Text>
            </View>
            
            <View style={styles.postMetricItem}>
              <View style={styles.postMetricHeader}>
                <Ionicons name="chatbubble-outline" size={16} color="#3b82f6" />
                <Text style={styles.postMetricLabel}>Comentários</Text>
              </View>
              <Text style={styles.postMetricValue}>{post.comments}</Text>
            </View>
            
            <View style={styles.postMetricItem}>
              <View style={styles.postMetricHeader}>
                <Ionicons name="share-outline" size={16} color="#10b981" />
                <Text style={styles.postMetricLabel}>Compartilhamentos</Text>
              </View>
              <Text style={styles.postMetricValue}>{post.shares}</Text>
            </View>
          </View>
          
          <View style={styles.postEngagement}>
            <Text style={styles.engagementLabel}>Taxa de Engajamento</Text>
            <View style={styles.engagementBar}>
              <View 
                style={[
                  styles.engagementFill, 
                  { width: `${Math.min(post.engagement_rate, 100)}%` }
                ]} 
              />
            </View>
            <Text style={styles.engagementValue}>{post.engagement_rate}%</Text>
          </View>
          
          <Text style={styles.postDate}>
            {new Date(post.created_at).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </Text>
        </View>
      ))}
    </View>
  );

  const renderWeeklyReport = () => (
    <View style={styles.weeklyReportContainer}>
      <Text style={styles.sectionTitle}>Relatório Semanal</Text>
      
      <View style={styles.reportCard}>
        <LinearGradient colors={['#1f2937', '#374151']} style={styles.reportGradient}>
          <View style={styles.reportHeader}>
            <Ionicons name="document-text-outline" size={24} color="white" />
            <Text style={styles.reportTitle}>Resumo da Semana</Text>
          </View>
          
          <View style={styles.reportStats}>
            <View style={styles.reportStat}>
              <Text style={styles.reportStatValue}>{formatNumber(weeklyStats.post_impressions)}</Text>
              <Text style={styles.reportStatLabel}>Total de Impressões</Text>
            </View>
            
            <View style={styles.reportStat}>
              <Text style={styles.reportStatValue}>{weeklyStats.total_applications}</Text>
              <Text style={styles.reportStatLabel}>Total de Candidaturas</Text>
            </View>
          </View>
          
          <TouchableOpacity style={styles.downloadReportButton}>
            <Ionicons name="download" size={16} color="#3b82f6" />
            <Text style={styles.downloadReportText}>Baixar Relatório Completo</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.container}>
        {renderHeader()}
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text style={styles.loadingText}>Carregando métricas...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {renderPeriodSelector()}
        {renderOverviewStats()}
        {renderPostMetrics()}
        {renderWeeklyReport()}
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
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingTop: 40,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  exportButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
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
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  periodButtonActive: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
  },
  periodButtonTextActive: {
    color: '#3b82f6',
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  overviewContainer: {
    marginBottom: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    width: (width - 64) / 2,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  statSubLabel: {
    fontSize: 11,
    color: '#9ca3af',
  },
  postsContainer: {
    marginBottom: 24,
  },
  postMetricCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  postContent: {
    fontSize: 14,
    color: '#1f2937',
    marginBottom: 16,
    lineHeight: 20,
  },
  postMetricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  postMetricItem: {
    width: (width - 84) / 2,
  },
  postMetricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  postMetricLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  postMetricValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  postEngagement: {
    marginBottom: 12,
  },
  engagementLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 6,
    fontWeight: '500',
  },
  engagementBar: {
    height: 6,
    backgroundColor: '#e5e7eb',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  engagementFill: {
    height: '100%',
    backgroundColor: '#3b82f6',
  },
  engagementValue: {
    fontSize: 12,
    color: '#3b82f6',
    fontWeight: '600',
    textAlign: 'right',
  },
  postDate: {
    fontSize: 11,
    color: '#9ca3af',
    textAlign: 'right',
  },
  weeklyReportContainer: {
    marginBottom: 24,
  },
  reportCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  reportGradient: {
    padding: 20,
  },
  reportHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  reportStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  reportStat: {
    alignItems: 'center',
  },
  reportStatValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  reportStatLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  downloadReportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
    alignSelf: 'center',
  },
  downloadReportText: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '600',
  },
});