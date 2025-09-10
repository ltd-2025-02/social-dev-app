
import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Alert, 
  Linking 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { applyToJob } from '../../store/slices/jobsSlice';
import { jobsService } from '../../services/jobs.service';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'remote' | 'hybrid' | 'onsite';
  level: 'junior' | 'pleno' | 'senior' | 'lead';
  salary_range?: string;
  description: string;
  requirements: string[];
  technologies: string[];
  created_at: string;
  applications_count: number;
  applied_by_user: boolean;
  is_featured: boolean;
  company_logo?: string;
  apply_url?: string;
  employment_type?: string;
  posted_date?: string;
}

export default function JobDetailScreen({ route, navigation }: any) {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { jobId } = route.params;
  
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadJobDetails();
  }, [jobId]);

  const loadJobDetails = async () => {
    try {
      setLoading(true);
      const jobData = await jobsService.getJobById(jobId);
      setJob(jobData);
    } catch (error) {
      console.error('Error loading job details:', error);
      Alert.alert('Erro', 'Não foi possível carregar os detalhes da vaga');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleApplyJob = async () => {
    if (!user) {
      Alert.alert('Login necessário', 'Faça login para candidatar-se a vagas');
      return;
    }

    if (!job) return;

    if (job.apply_url) {
      Alert.alert(
        'Candidatar-se à vaga',
        'Você será redirecionado para o site da empresa para se candidatar.',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Continuar',
            onPress: () => {
              Linking.openURL(job.apply_url!);
              dispatch(applyToJob({ jobId: job.id, userId: user.id }));
            },
          },
        ]
      );
    } else {
      Alert.alert(
        'Candidatar-se à vaga',
        'Deseja se candidatar a esta vaga? Seu perfil será enviado para a empresa.',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Candidatar-se',
            onPress: async () => {
              try {
                await dispatch(applyToJob({ jobId: job.id, userId: user.id })).unwrap();
                Alert.alert('Sucesso!', 'Candidatura enviada com sucesso!');
                setJob({ ...job, applied_by_user: true });
              } catch (error: any) {
                Alert.alert('Erro', error.message || 'Erro ao enviar candidatura');
              }
            },
          },
        ]
      );
    }
  };

  const getJobTypeColor = (type: string) => {
    switch (type) {
      case 'remote': return '#10b981';
      case 'hybrid': return '#f59e0b';
      case 'onsite': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  const getJobTypeLabel = (type: string) => {
    switch (type) {
      case 'remote': return 'Remoto';
      case 'hybrid': return 'Híbrido';
      case 'onsite': return 'Presencial';
      default: return type;
    }
  };

  const getLevelLabel = (level: string) => {
    switch (level) {
      case 'junior': return 'Júnior';
      case 'pleno': return 'Pleno';
      case 'senior': return 'Sênior';
      case 'lead': return 'Tech Lead';
      default: return level;
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#1f2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Detalhes da Vaga</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Carregando...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!job) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#1f2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Detalhes da Vaga</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Vaga não encontrada</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#1f2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalhes da Vaga</Text>
        <TouchableOpacity style={styles.bookmarkButton}>
          <Ionicons name="bookmark-outline" size={24} color="#1f2937" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Job Header */}
          <View style={styles.jobHeader}>
            {job.is_featured && (
              <View style={styles.featuredBadge}>
                <Ionicons name="star" size={12} color="#fff" />
                <Text style={styles.featuredText}>Destaque</Text>
              </View>
            )}
            
            <Text style={styles.jobTitle}>{job.title}</Text>
            <Text style={styles.jobCompany}>{job.company}</Text>
            
            <View style={styles.jobMeta}>
              <View style={styles.metaItem}>
                <Ionicons name="location-outline" size={16} color="#6b7280" />
                <Text style={styles.metaText}>{job.location}</Text>
              </View>
              <View style={[styles.typeBadge, { backgroundColor: getJobTypeColor(job.type) }]}>
                <Text style={styles.typeText}>{getJobTypeLabel(job.type)}</Text>
              </View>
              <View style={styles.levelBadge}>
                <Text style={styles.levelText}>{getLevelLabel(job.level)}</Text>
              </View>
            </View>

            {job.salary_range && (
              <View style={styles.salarySection}>
                <Ionicons name="card-outline" size={16} color="#059669" />
                <Text style={styles.salaryText}>{job.salary_range}</Text>
              </View>
            )}
          </View>

          {/* Technologies */}
          {job.technologies && job.technologies.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Tecnologias</Text>
              <View style={styles.techGrid}>
                {job.technologies.map((tech, index) => (
                  <View key={index} style={styles.techTag}>
                    <Text style={styles.techText}>{tech}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Descrição da vaga</Text>
            <Text style={styles.description}>{job.description}</Text>
          </View>

          {/* Requirements */}
          {job.requirements && job.requirements.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Requisitos</Text>
              {job.requirements.map((requirement, index) => (
                <View key={index} style={styles.requirementItem}>
                  <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                  <Text style={styles.requirementText}>{requirement}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Job Stats */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Informações da vaga</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Ionicons name="people-outline" size={20} color="#3b82f6" />
                <Text style={styles.statLabel}>Candidatos</Text>
                <Text style={styles.statValue}>{job.applications_count}</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="calendar-outline" size={20} color="#3b82f6" />
                <Text style={styles.statLabel}>Publicado</Text>
                <Text style={styles.statValue}>
                  {new Date(job.created_at).toLocaleDateString('pt-BR')}
                </Text>
              </View>
              {job.employment_type && (
                <View style={styles.statItem}>
                  <Ionicons name="briefcase-outline" size={20} color="#3b82f6" />
                  <Text style={styles.statLabel}>Tipo</Text>
                  <Text style={styles.statValue}>{job.employment_type}</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Apply Button */}
      <View style={styles.footer}>
        {job.applied_by_user ? (
          <View style={styles.appliedButton}>
            <Ionicons name="checkmark-circle" size={20} color="#10b981" />
            <Text style={styles.appliedButtonText}>Candidatura enviada</Text>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.applyButton}
            onPress={handleApplyJob}
          >
            <Text style={styles.applyButtonText}>Candidatar-se à vaga</Text>
          </TouchableOpacity>
        )}
      </View>
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f9fafb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  bookmarkButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f9fafb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#ef4444',
  },
  scrollContainer: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  jobHeader: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  featuredBadge: {
    position: 'absolute',
    top: -1,
    right: 16,
    backgroundColor: '#f59e0b',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  featuredText: {
    fontSize: 10,
    color: 'white',
    fontWeight: '600',
    marginLeft: 4,
  },
  jobTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  jobCompany: {
    fontSize: 18,
    color: '#3b82f6',
    fontWeight: '600',
    marginBottom: 16,
  },
  jobMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  metaText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 4,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 8,
  },
  typeText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '600',
  },
  levelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#f3f4f6',
  },
  levelText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '600',
  },
  salarySection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  salaryText: {
    fontSize: 16,
    color: '#059669',
    fontWeight: '600',
    marginLeft: 8,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
  },
  techGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  techTag: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  techText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '500',
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  requirementText: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 8,
    flex: 1,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  statValue: {
    fontSize: 14,
    color: '#1f2937',
    fontWeight: '600',
    marginTop: 2,
  },
  footer: {
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  applyButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
  appliedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#d1fae5',
    paddingVertical: 16,
    borderRadius: 12,
  },
  appliedButtonText: {
    fontSize: 16,
    color: '#059669',
    fontWeight: '600',
    marginLeft: 8,
  },
});
