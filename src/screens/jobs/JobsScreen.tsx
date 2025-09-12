
import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  Modal,
  Alert,
  Dimensions,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { fetchJobs, fetchFeaturedJobs, setFilters, clearFilters, applyToJob } from '../../store/slices/jobsSlice';
import { useTheme } from '../../contexts/ThemeContext';
import UniversalHeader from '../../components/UniversalHeader';

const { width } = Dimensions.get('window');

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
}

export default function JobsScreen({ navigation }: any) {
  const dispatch = useDispatch<AppDispatch>();
  const { jobs, featuredJobs, loading, error, filters } = useSelector((state: RootState) => state.jobs);
  const { user } = useSelector((state: RootState) => state.auth);
  const { colors } = useTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    dispatch(fetchJobs(filters));
    dispatch(fetchFeaturedJobs());
  }, [dispatch, filters]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    Promise.all([
      dispatch(fetchJobs(filters)),
      dispatch(fetchFeaturedJobs())
    ]).finally(() => setRefreshing(false));
  }, [dispatch, filters]);

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
              await dispatch(applyToJob({ jobId, userId: user.id })).unwrap();
              Alert.alert('Sucesso!', 'Candidatura enviada com sucesso!');
            } catch (error: any) {
              Alert.alert('Erro', error.message || 'Erro ao enviar candidatura');
            }
          },
        },
      ]
    );
  };

  const handleSearch = () => {
    dispatch(setFilters({ ...filters, search: searchQuery }));
  };

  const handleFilterChange = (key: string, value: any) => {
    dispatch(setFilters({ ...filters, [key]: value }));
  };

  const clearAllFilters = () => {
    dispatch(clearFilters());
    setSearchQuery('');
    setShowFilters(false);
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

  const renderFeaturedJob = (job: Job, index: number) => (
    <TouchableOpacity
      key={job.id}
      style={[styles.featuredCard, index === 0 && styles.featuredCardFirst]}
      onPress={() => navigation.navigate('JobDetail', { jobId: job.id })}
    >
      {/* Premium Badge */}
      <View style={styles.featuredBadgeContainer}>
        <View style={styles.featuredBadgeSmall}>
          <Ionicons name="diamond" size={12} color="#fff" />
          <Text style={[styles.featuredTextSmall, { marginLeft: 4 }]}>Premium</Text>
        </View>
      </View>

      {/* Company Logo */}
      {job.company_logo && (
        <View style={styles.featuredLogoContainer}>
          <Image 
            source={{ uri: job.company_logo }} 
            style={styles.featuredLogo}
            resizeMode="contain"
          />
        </View>
      )}

      {/* Job Title */}
      <Text style={styles.featuredJobTitle} numberOfLines={2}>
        {job.title}
      </Text>
      
      {/* Company Name */}
      <Text style={styles.featuredJobCompany}>{job.company}</Text>
      
      {/* Location and Type */}
      <View style={styles.featuredJobMeta}>
        <View style={styles.featuredMetaItem}>
          <Ionicons name="location-outline" size={14} color={colors.textMuted} />
          <Text style={[styles.featuredMetaText, { marginLeft: 4, color: colors.textMuted }]}>
            {job.location}
          </Text>
        </View>
        <View style={[styles.featuredTypeBadge, { backgroundColor: getJobTypeColor(job.type) }]}>
          <Text style={styles.featuredTypeText}>{getJobTypeLabel(job.type)}</Text>
        </View>
      </View>

      {/* Technologies */}
      {job.technologies && job.technologies.length > 0 && (
        <View style={styles.featuredTechSection}>
          <View style={styles.featuredTechList}>
            {job.technologies.slice(0, 3).map((tech, techIndex) => (
              <View key={techIndex} style={styles.featuredTechTag}>
                <Text style={styles.featuredTechText}>{tech}</Text>
              </View>
            ))}
            {job.technologies.length > 3 && (
              <Text style={styles.featuredMoreTech}>+{job.technologies.length - 3}</Text>
            )}
          </View>
        </View>
      )}

      {/* Salary and Application Count */}
      <View style={styles.featuredFooter}>
        {job.salary_range && (
          <View style={styles.featuredSalaryContainer}>
            <Ionicons name="card-outline" size={14} color="#059669" />
            <Text style={styles.featuredSalary}>{job.salary_range}</Text>
          </View>
        )}
        <Text style={styles.featuredApplications}>
          {job.applications_count} candidatos
        </Text>
      </View>

      {/* Action Button */}
      <TouchableOpacity style={styles.featuredActionButton}>
        <Text style={styles.featuredActionText}>Ver Detalhes</Text>
        <Ionicons name="arrow-forward" size={14} color="#fff" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderJobCard = (job: Job) => (
    <TouchableOpacity
      key={job.id}
      style={[styles.jobCard, job.is_featured && styles.featuredJobCard]}
      onPress={() => navigation.navigate('JobDetail', { jobId: job.id })}
    >
      {job.is_featured && (
        <View style={styles.featuredBadge}>
          <Ionicons name="star" size={12} color="#fff" />
          <Text style={[styles.featuredText, { marginLeft: 4 }]}>Destaque</Text>
        </View>
      )}

      <View style={styles.jobHeader}>
        <View style={styles.jobTitleSection}>
          <Text style={styles.jobTitle} numberOfLines={2}>
            {job.title}
          </Text>
          <View style={styles.companySection}>
            {job.company_logo && (
              <Image source={{ uri: job.company_logo }} style={[styles.companyLogo, { marginRight: 8 }]} />
            )}
            <Text style={styles.jobCompany}>{job.company}</Text>
          </View>
        </View>
        <View style={styles.jobActions}>
          <TouchableOpacity
            style={styles.bookmarkButton}
            onPress={() => {/* Handle bookmark */}}
          >
            <Ionicons name="bookmark-outline" size={20} color="#6b7280" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.jobMeta}>
        <View style={styles.metaItem}>
          <Ionicons name="location-outline" size={14} color="#6b7280" />
          <Text style={[styles.metaText, { marginLeft: 4 }]}>{job.location}</Text>
        </View>
        <View style={[styles.jobTypeBadge, { backgroundColor: getJobTypeColor(job.type) }]}>
          <Text style={styles.jobTypeText}>{getJobTypeLabel(job.type)}</Text>
        </View>
        <View style={styles.levelBadge}>
          <Text style={styles.levelText}>{getLevelLabel(job.level)}</Text>
        </View>
      </View>

      {job.salary_range && (
        <View style={styles.salarySection}>
          <Ionicons name="card-outline" size={14} color="#059669" />
          <Text style={[styles.salaryText, { marginLeft: 6 }]}>{job.salary_range}</Text>
        </View>
      )}

      {job.technologies && job.technologies.length > 0 && (
        <View style={styles.technologiesSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.techList}>
              {job.technologies.slice(0, 5).map((tech, index) => (
                <View key={index} style={[styles.techTag, { marginRight: 6 }]}>
                  <Text style={styles.techText}>{tech}</Text>
                </View>
              ))}
              {job.technologies.length > 5 && (
                <Text style={styles.moreTech}>+{job.technologies.length - 5}</Text>
              )}
            </View>
          </ScrollView>
        </View>
      )}

      <View style={styles.jobFooter}>
        <View style={styles.jobStats}>
          <Text style={styles.applicationsText}>
            {job.applications_count} candidatos
          </Text>
          <Text style={styles.postedText}>
            {new Date(job.created_at).toLocaleDateString('pt-BR')}
          </Text>
        </View>
        
        {job.applied_by_user ? (
          <View style={styles.appliedButton}>
            <Ionicons name="checkmark-circle" size={16} color="#10b981" />
            <Text style={[styles.appliedButtonText, { marginLeft: 4 }]}>Candidato</Text>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.applyButton}
            onPress={() => handleApplyJob(job.id)}
          >
            <Text style={styles.applyButtonText}>Candidatar-se</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Vagas</Text>
            <Text style={styles.subtitle}>
              {jobs.length > 0 
                ? `${jobs.length} oportunidade${jobs.length !== 1 ? 's' : ''} encontrada${jobs.length !== 1 ? 's' : ''}`
                : 'Nenhuma vaga encontrada'
              }
            </Text>
          </View>
          <View style={styles.headerButtons}>
            <TouchableOpacity 
              style={styles.intelligentButton}
              onPress={() => navigation.navigate('IntelligentJobs')}
            >
              <Ionicons name="sparkles" size={20} color="white" />
              <Text style={styles.intelligentButtonText}>IA</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.filterButton}
              onPress={() => setShowFilters(true)}
            >
              <Ionicons name="filter-outline" size={24} color="#333" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Ionicons name="search-outline" size={20} color="#9ca3af" />
            <TextInput
              style={[styles.searchInput, { marginHorizontal: 8 }]}
              placeholder="Buscar vagas..."
              placeholderTextColor="#9ca3af"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={20} color="#9ca3af" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Active Filters */}
        {(filters.location || filters.type || filters.level) && (
          <View style={styles.activeFilters}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.filtersList}>
                {filters.location && (
                  <View style={styles.activeFilter}>
                    <Text style={styles.activeFilterText}>{filters.location}</Text>
                    <TouchableOpacity onPress={() => handleFilterChange('location', '')} style={{ marginLeft: 6 }}>
                      <Ionicons name="close" size={14} color="#3b82f6" />
                    </TouchableOpacity>
                  </View>
                )}
                {filters.type && (
                  <View style={styles.activeFilter}>
                    <Text style={styles.activeFilterText}>{getJobTypeLabel(filters.type)}</Text>
                    <TouchableOpacity onPress={() => handleFilterChange('type', '')} style={{ marginLeft: 6 }}>
                      <Ionicons name="close" size={14} color="#3b82f6" />
                    </TouchableOpacity>
                  </View>
                )}
                {filters.level && (
                  <View style={styles.activeFilter}>
                    <Text style={styles.activeFilterText}>{getLevelLabel(filters.level)}</Text>
                    <TouchableOpacity onPress={() => handleFilterChange('level', '')} style={{ marginLeft: 6 }}>
                      <Ionicons name="close" size={14} color="#3b82f6" />
                    </TouchableOpacity>
                  </View>
                )}
                <TouchableOpacity style={styles.clearFiltersButton} onPress={clearAllFilters}>
                  <Text style={styles.clearFiltersText}>Limpar todos</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        )}

        {/* Featured Jobs */}
        {featuredJobs.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Vagas em Destaque</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>Ver todas</Text>
              </TouchableOpacity>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.featuredJobsContent}
            >
              {featuredJobs.map((job, index) => renderFeaturedJob(job, index))}
            </ScrollView>
          </View>
        )}

        {/* Jobs List */}
        <View style={styles.section}>
          <View style={styles.statsBar}>
            <View style={styles.statsLeft}>
              {loading ? (
                <View style={styles.loadingContainer}>
                  <Text style={styles.resultsText}>Carregando vagas...</Text>
                </View>
              ) : (
                <View>
                  <Text style={styles.resultsText}>
                    {jobs.length} vagas encontradas
                  </Text>
                  {jobs.some(job => job.id.startsWith('mock-')) && (
                    <Text style={styles.demoText}>
                      🎯 Mostrando vagas de demonstração
                    </Text>
                  )}
                  {jobs.some(job => job.id.startsWith('theirstack-')) && (
                    <Text style={styles.apiSourceText}>
                      🔥 Vagas do TheirStack (LinkedIn, Indeed, Google)
                    </Text>
                  )}
                  {jobs.some(job => !job.id.startsWith('mock-') && !job.id.startsWith('theirstack-')) && (
                    <Text style={styles.apiSourceText}>
                      📊 Vagas do Google Jobs via SerpAPI
                    </Text>
                  )}
                </View>
              )}
            </View>
            <View style={styles.sortSection}>
              <TouchableOpacity style={styles.sortButton}>
                <Text style={styles.sortText}>Mais recentes</Text>
                <Ionicons name="chevron-down" size={16} color="#6b7280" style={{ marginLeft: 4 }} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.jobsList}>
            {jobs.map(renderJobCard)}
            
            {jobs.length === 0 && !loading && (
              <View style={styles.emptyState}>
                <Ionicons name="briefcase-outline" size={48} color="#94a3b8" />
                <Text style={styles.emptyStateTitle}>Nenhuma vaga encontrada</Text>
                <Text style={styles.emptyStateText}>
                  Não encontramos vagas com os filtros aplicados. Tente ajustar os critérios de busca.
                </Text>
                <TouchableOpacity
                  style={styles.emptyStateButton}
                  onPress={clearAllFilters}
                >
                  <Text style={styles.emptyStateButtonText}>Limpar filtros</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Filters Modal */}
      <Modal
        visible={showFilters}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowFilters(false)}>
              <Text style={styles.modalCancelButton}>Cancelar</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Filtros</Text>
            <TouchableOpacity onPress={() => setShowFilters(false)}>
              <Text style={styles.modalApplyButton}>Aplicar</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {/* Location Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Localização</Text>
              <TextInput
                style={styles.filterInput}
                placeholder="Ex: São Paulo, Remote..."
                value={filters.location}
                onChangeText={(text) => handleFilterChange('location', text)}
              />
            </View>

            {/* Job Type Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Tipo de trabalho</Text>
              <View style={styles.optionsGrid}>
                {['remote', 'hybrid', 'onsite'].map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.optionButton,
                      { width: '30%', marginRight: 8 },
                      filters.type === type && styles.optionButtonSelected
                    ]}
                    onPress={() => handleFilterChange('type', filters.type === type ? '' : type)}
                  >
                    <Text style={[
                      styles.optionText,
                      filters.type === type && styles.optionTextSelected
                    ]}>
                      {getJobTypeLabel(type)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Level Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Nível</Text>
              <View style={styles.optionsGrid}>
                {['junior', 'pleno', 'senior', 'lead'].map((level) => (
                  <TouchableOpacity
                    key={level}
                    style={[
                      styles.optionButton,
                      { width: '22%', marginRight: 8 },
                      filters.level === level && styles.optionButtonSelected
                    ]}
                    onPress={() => handleFilterChange('level', filters.level === level ? '' : level)}
                  >
                    <Text style={[
                      styles.optionText,
                      filters.level === level && styles.optionTextSelected
                    ]}>
                      {getLevelLabel(level)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity style={styles.clearAllButton} onPress={clearAllFilters}>
              <Text style={styles.clearAllButtonText}>Limpar todos os filtros</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Modal>
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
  searchSection: {
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1f2937',
  },
  section: {
    marginBottom: 32,
  },
  activeFilters: {
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  filtersList: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  activeFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dbeafe',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  activeFilterText: {
    fontSize: 12,
    color: '#1e40af',
    fontWeight: '500',
  },
  clearFiltersButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  clearFiltersText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  statsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statsLeft: {
    flex: 1,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultsText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  demoText: {
    fontSize: 12,
    color: '#f59e0b',
    fontWeight: '500',
    marginTop: 2,
  },
  apiSourceText: {
    fontSize: 12,
    color: '#10b981',
    fontWeight: '600',
    marginTop: 2,
  },
  sortSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sortText: {
    fontSize: 14,
    color: '#6b7280',
  },
  jobsList: {
    paddingBottom: 20,
  },
  bottomSpacing: {
    height: 50,
  },
  jobCard: {
    backgroundColor: 'white',
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  featuredJobCard: {
    borderWidth: 2,
    borderColor: '#f59e0b',
  },
  featuredBadge: {
    position: 'absolute',
    top: -1,
    right: 16,
    backgroundColor: '#f59e0b',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  jobTitleSection: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  companySection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  companyLogo: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
  },
  jobCompany: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '600',
    flex: 1,
  },
  jobActions: {
    alignItems: 'center',
  },
  bookmarkButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f9fafb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  jobMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flex: 1,
  },
  metaText: {
    fontSize: 12,
    color: '#6b7280',
  },
  jobTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  jobTypeText: {
    fontSize: 10,
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
    fontSize: 10,
    color: '#374151',
    fontWeight: '600',
  },
  salarySection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 12,
  },
  salaryText: {
    fontSize: 14,
    color: '#059669',
    fontWeight: '600',
  },
  technologiesSection: {
    marginBottom: 16,
  },
  techList: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  techTag: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  techText: {
    fontSize: 10,
    color: '#475569',
    fontWeight: '500',
  },
  moreTech: {
    fontSize: 10,
    color: '#6b7280',
    marginLeft: 4,
  },
  jobFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  jobStats: {
    flex: 1,
  },
  applicationsText: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 2,
  },
  postedText: {
    fontSize: 12,
    color: '#9ca3af',
  },
  applyButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  applyButtonText: {
    fontSize: 14,
    color: 'white',
    fontWeight: '600',
  },
  appliedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#d1fae5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  appliedButtonText: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '600',
  },
  emptyState: {
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
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalCancelButton: {
    fontSize: 16,
    color: '#6b7280',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  modalApplyButton: {
    fontSize: 16,
    color: '#3b82f6',
    fontWeight: 'bold',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  filterSection: {
    marginBottom: 24,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  filterInput: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1f2937',
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
  },
  optionButtonSelected: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  optionText: {
    fontSize: 14,
    color: '#6b7280',
  },
  optionTextSelected: {
    color: 'white',
  },
  clearAllButton: {
    backgroundColor: '#f3f4f6',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  clearAllButtonText: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '600',
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
  featuredJobsContent: {
    paddingRight: 20,
  },
  featuredCard: {
    width: width * 0.8,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    marginRight: 16,
    borderWidth: 2,
    borderColor: '#8b5cf6',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    minHeight: 280,
  },
  featuredCardFirst: {
    marginLeft: 20,
  },
  featuredBadgeContainer: {
    position: 'absolute',
    top: -2,
    right: 16,
    zIndex: 10,
  },
  featuredBadgeSmall: {
    backgroundColor: '#8b5cf6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  featuredTextSmall: {
    fontSize: 11,
    color: 'white',
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  featuredLogoContainer: {
    alignSelf: 'flex-start',
    marginBottom: 12,
    marginTop: 8,
  },
  featuredLogo: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  featuredJobTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1f2937',
    marginBottom: 8,
    lineHeight: 24,
  },
  featuredJobCompany: {
    fontSize: 14,
    color: '#8b5cf6',
    fontWeight: '700',
    marginBottom: 16,
  },
  featuredJobMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  featuredMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  featuredMetaText: {
    fontSize: 12,
    fontWeight: '500',
  },
  featuredTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  featuredTypeText: {
    fontSize: 10,
    color: 'white',
    fontWeight: '700',
  },
  featuredTechSection: {
    marginBottom: 16,
  },
  featuredTechList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  featuredTechTag: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 6,
    marginBottom: 4,
  },
  featuredTechText: {
    fontSize: 10,
    color: '#475569',
    fontWeight: '600',
  },
  featuredMoreTech: {
    fontSize: 10,
    color: '#8b5cf6',
    fontWeight: '600',
    marginLeft: 4,
  },
  featuredFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  featuredSalaryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featuredSalary: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '700',
    marginLeft: 4,
  },
  featuredApplications: {
    fontSize: 11,
    color: '#6b7280',
    fontWeight: '500',
  },
  featuredActionButton: {
    backgroundColor: '#8b5cf6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  featuredActionText: {
    fontSize: 14,
    color: 'white',
    fontWeight: '700',
    marginRight: 6,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  intelligentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8b5cf6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  intelligentButtonText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '700',
  },
  filterButton: {
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
});
