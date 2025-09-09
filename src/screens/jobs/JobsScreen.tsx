
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
      <View style={styles.featuredBadgeContainer}>
        <View style={styles.featuredBadgeSmall}>
          <Ionicons name="star" size={10} color="#fff" />
          <Text style={styles.featuredTextSmall}>Destaque</Text>
        </View>
      </View>

      <Text style={styles.featuredJobTitle} numberOfLines={2}>
        {job.title}
      </Text>
      <Text style={styles.featuredJobCompany}>{job.company}</Text>
      
      <View style={styles.featuredJobMeta}>
        <View style={styles.featuredMetaItem}>
          <Ionicons name="location-outline" size={12} color="#6b7280" />
          <Text style={styles.featuredMetaText}>{job.location}</Text>
        </View>
        <View style={[styles.featuredTypeBadge, { backgroundColor: getJobTypeColor(job.type) }]}>
          <Text style={styles.featuredTypeText}>{getJobTypeLabel(job.type)}</Text>
        </View>
      </View>

      {job.salary_range && (
        <Text style={styles.featuredSalary}>{job.salary_range}</Text>
      )}
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
          <Text style={styles.featuredText}>Destaque</Text>
        </View>
      )}

      <View style={styles.jobHeader}>
        <View style={styles.jobTitleSection}>
          <Text style={styles.jobTitle} numberOfLines={2}>
            {job.title}
          </Text>
          <View style={styles.companySection}>
            {job.company_logo && (
              <Image source={{ uri: job.company_logo }} style={styles.companyLogo} />
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
          <Text style={styles.metaText}>{job.location}</Text>
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
          <Text style={styles.salaryText}>{job.salary_range}</Text>
        </View>
      )}

      {job.technologies && job.technologies.length > 0 && (
        <View style={styles.technologiesSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.techList}>
              {job.technologies.slice(0, 5).map((tech, index) => (
                <View key={index} style={styles.techTag}>
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
            <Text style={styles.appliedButtonText}>Candidato</Text>
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
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Vagas</Text>
        <TouchableOpacity style={styles.headerButton}>
          <Ionicons name="notifications-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Search and Filters */}
      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#6b7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar vagas..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#6b7280" />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilters(true)}
        >
          <Ionicons name="filter-outline" size={20} color="#3b82f6" />
        </TouchableOpacity>
      </View>

      {/* Active Filters */}
      {(filters.location || filters.type || filters.level) && (
        <View style={styles.activeFilters}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.filtersList}>
              {filters.location && (
                <View style={styles.activeFilter}>
                  <Text style={styles.activeFilterText}>{filters.location}</Text>
                  <TouchableOpacity onPress={() => handleFilterChange('location', '')}>
                    <Ionicons name="close" size={14} color="#3b82f6" />
                  </TouchableOpacity>
                </View>
              )}
              {filters.type && (
                <View style={styles.activeFilter}>
                  <Text style={styles.activeFilterText}>{getJobTypeLabel(filters.type)}</Text>
                  <TouchableOpacity onPress={() => handleFilterChange('type', '')}>
                    <Ionicons name="close" size={14} color="#3b82f6" />
                  </TouchableOpacity>
                </View>
              )}
              {filters.level && (
                <View style={styles.activeFilter}>
                  <Text style={styles.activeFilterText}>{getLevelLabel(filters.level)}</Text>
                  <TouchableOpacity onPress={() => handleFilterChange('level', '')}>
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
        <>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Vagas em Destaque</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>Ver todas</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.featuredJobsList}
            contentContainerStyle={styles.featuredJobsContent}
          >
            {featuredJobs.map((job, index) => renderFeaturedJob(job, index))}
          </ScrollView>
        </>
      )}

      {/* Job Stats */}
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
            </View>
          )}
        </View>
        <View style={styles.sortSection}>
          <TouchableOpacity style={styles.sortButton}>
            <Text style={styles.sortText}>Mais recentes</Text>
            <Ionicons name="chevron-down" size={16} color="#6b7280" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Jobs List */}
      <ScrollView
        style={styles.jobsList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {jobs.map(renderJobCard)}
        
        {jobs.length === 0 && !loading && (
          <View style={styles.emptyState}>
            <View style={styles.emptyStateIcon}>
              <Ionicons name="briefcase-outline" size={64} color="#94a3b8" />
            </View>
            <Text style={styles.emptyStateTitle}>Nenhuma vaga encontrada</Text>
            <Text style={styles.emptyStateText}>
              Não encontramos vagas com os filtros aplicados.{'\n'}
              Tente ajustar os critérios de busca ou explorar outras opções.
            </Text>
            <View style={styles.emptyStateActions}>
              <TouchableOpacity style={styles.clearFiltersEmptyButton} onPress={clearAllFilters}>
                <Ionicons name="refresh" size={16} color="white" />
                <Text style={styles.clearFiltersEmptyText}>Limpar filtros</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.searchAgainButton}
                onPress={() => {
                  setSearchQuery('desenvolvedor');
                  dispatch(setFilters({ search: 'desenvolvedor' }));
                }}
              >
                <Text style={styles.searchAgainText}>Buscar "desenvolvedor"</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchSection: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    gap: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1f2937',
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#f0f9ff',
    borderWidth: 1,
    borderColor: '#bae6fd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeFilters: {
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  filtersList: {
    flexDirection: 'row',
    gap: 8,
  },
  activeFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dbeafe',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
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
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  statsLeft: {
    flex: 1,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
  sortSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sortText: {
    fontSize: 14,
    color: '#6b7280',
  },
  jobsList: {
    flex: 1,
  },
  jobCard: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
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
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    gap: 4,
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
    gap: 8,
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
    marginBottom: 12,
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
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
    marginBottom: 12,
    gap: 6,
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
    gap: 6,
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
    backgroundColor: '#d1fae5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  appliedButtonText: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 64,
    paddingHorizontal: 32,
  },
  emptyStateIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 32,
  },
  emptyStateActions: {
    gap: 12,
    width: '100%',
  },
  clearFiltersEmptyButton: {
    backgroundColor: '#3b82f6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  clearFiltersEmptyText: {
    fontSize: 14,
    color: 'white',
    fontWeight: '600',
  },
  searchAgainButton: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  searchAgainText: {
    fontSize: 14,
    color: '#4b5563',
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
    gap: 8,
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
  // Featured Jobs Styles
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: 'white',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  seeAllText: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '600',
  },
  featuredJobsList: {
    backgroundColor: 'white',
    paddingBottom: 16,
  },
  featuredJobsContent: {
    paddingHorizontal: 16,
  },
  featuredCard: {
    width: width * 0.75,
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#f59e0b',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  featuredCardFirst: {
    marginLeft: 0,
  },
  featuredBadgeContainer: {
    position: 'absolute',
    top: -2,
    right: 12,
  },
  featuredBadgeSmall: {
    backgroundColor: '#f59e0b',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    gap: 3,
  },
  featuredTextSmall: {
    fontSize: 9,
    color: 'white',
    fontWeight: '700',
  },
  featuredJobTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 6,
    marginTop: 8,
  },
  featuredJobCompany: {
    fontSize: 13,
    color: '#3b82f6',
    fontWeight: '600',
    marginBottom: 12,
  },
  featuredJobMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  featuredMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  featuredMetaText: {
    fontSize: 11,
    color: '#6b7280',
  },
  featuredTypeBadge: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
  },
  featuredTypeText: {
    fontSize: 9,
    color: 'white',
    fontWeight: '600',
  },
  featuredSalary: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '600',
  },
});
