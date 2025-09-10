import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { fetchFeaturedJobs } from '../../store/slices/jobsSlice';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { featuredJobs } = useSelector((state) => state.jobs);

  useEffect(() => {
    dispatch(fetchFeaturedJobs());
  }, [dispatch]);

  const quickActions = [
    {
      icon: 'newspaper-outline',
      title: 'Feed',
      subtitle: 'Ver posts',
      color: '#3b82f6',
      onPress: () => navigation.navigate('Feed'),
    },
    {
      icon: 'briefcase-outline',
      title: 'Vagas',
      subtitle: 'Oportunidades',
      color: '#10b981',
      onPress: () => navigation.navigate('Jobs'),
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
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Olá, {user?.name?.split(' ')[0]}! 👋</Text>
            <Text style={styles.subtitle}>Bem-vindo ao SocialDev</Text>
          </View>
          <TouchableOpacity 
            style={styles.notificationButton}
            onPress={() => navigation.navigate('Settings')}
          >
            <Ionicons name="settings-outline" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statsCard}>
            <Text style={styles.statsNumber}>10K+</Text>
            <Text style={styles.statsLabel}>Desenvolvedores</Text>
          </View>
          <View style={styles.statsCard}>
            <Text style={styles.statsNumber}>2.5K+</Text>
            <Text style={styles.statsLabel}>Projetos</Text>
          </View>
          <View style={styles.statsCard}>
            <Text style={styles.statsNumber}>50+</Text>
            <Text style={styles.statsLabel}>Linguagens</Text>
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
                  <Ionicons name={action.icon} size={24} color="white" />
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

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Atividade recente</Text>
          <View style={styles.activityCard}>
            <Ionicons name="information-circle-outline" size={48} color="#94a3b8" />
            <Text style={styles.emptyStateTitle}>Nenhuma atividade ainda</Text>
            <Text style={styles.emptyStateText}>
              Comece a interagir com outros desenvolvedores para ver suas atividades aqui
            </Text>
            <TouchableOpacity
              style={styles.emptyStateButton}
              onPress={() => navigation.navigate('Feed')}
              activeOpacity={0.8}
            >
              <Text style={styles.emptyStateButtonText}>Explorar Feed</Text>
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
  notificationButton: {
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
    marginBottom: 32,
    gap: 12,
  },
  statsCard: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statsNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  statsLabel: {
    fontSize: 12,
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
});