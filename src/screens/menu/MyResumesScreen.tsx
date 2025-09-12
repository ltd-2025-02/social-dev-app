import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert,
  RefreshControl,
  ActivityIndicator,
  Dimensions,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { savedResumeService, SavedResume, ResumeTemplate } from '../../services/savedResume.service';
import { useTheme } from '../../contexts/ThemeContext';
import UniversalHeader from '../../components/UniversalHeader';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2; // 2 columns with padding

interface MyResumesScreenProps {
  navigation: any;
}

export default function MyResumesScreen({ navigation }: MyResumesScreenProps) {
  const { user } = useSelector((state: RootState) => state.auth);
  const { colors } = useTheme();
  
  const [resumes, setResumes] = useState<SavedResume[]>([]);
  const [templates, setTemplates] = useState<ResumeTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'my-resumes' | 'templates'>('my-resumes');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const [resumesData, templatesData, statsData] = await Promise.all([
        savedResumeService.getUserResumes(user.id),
        savedResumeService.getResumeTemplates(),
        savedResumeService.getUserStats(user.id)
      ]);

      setResumes(resumesData);
      setTemplates(templatesData);
      setStats(statsData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      Alert.alert('Erro', 'Não foi possível carregar os currículos.');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleCreateNewResume = () => {
    navigation.navigate('ResumeBuilder');
  };

  const handleResumePress = (resume: SavedResume) => {
    Alert.alert(
      resume.title,
      'O que você gostaria de fazer?',
      [
        {
          text: 'Visualizar',
          onPress: () => navigation.navigate('ResumePreview', { resumeId: resume.id })
        },
        {
          text: 'Editar',
          onPress: () => navigation.navigate('ResumeEditor', { resumeId: resume.id })
        },
        {
          text: 'Download',
          onPress: () => handleDownload(resume)
        },
        {
          text: 'Compartilhar',
          onPress: () => handleShare(resume)
        },
        { text: 'Cancelar', style: 'cancel' }
      ]
    );
  };

  const handleDownload = async (resume: SavedResume) => {
    try {
      Alert.alert(
        'Formato do Download',
        'Escolha o formato do arquivo:',
        [
          {
            text: 'PDF',
            onPress: async () => {
              await savedResumeService.downloadResume(resume, 'pdf');
              // Refresh stats
              loadData();
            }
          },
          {
            text: 'HTML',
            onPress: async () => {
              await savedResumeService.downloadResume(resume, 'html');
              loadData();
            }
          },
          { text: 'Cancelar', style: 'cancel' }
        ]
      );
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível fazer o download.');
    }
  };

  const handleShare = async (resume: SavedResume) => {
    try {
      const shareUrl = await savedResumeService.shareResume(resume.id, resume.user_id);
      
      await Share.share({
        message: `Confira meu currículo: ${resume.title}\n\n${shareUrl}`,
        title: `Currículo: ${resume.title}`,
        url: shareUrl,
      });

      // Refresh stats
      loadData();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível compartilhar o currículo.');
    }
  };

  const handleTemplatePress = (template: ResumeTemplate) => {
    navigation.navigate('ResumeBuilder', { templateId: template.id });
  };

  const handleDeleteResume = (resume: SavedResume) => {
    Alert.alert(
      'Excluir Currículo',
      `Tem certeza que deseja excluir "${resume.title}"? Esta ação não pode ser desfeita.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await savedResumeService.deleteResume(resume.id);
              loadData();
              Alert.alert('Sucesso', 'Currículo excluído com sucesso!');
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível excluir o currículo.');
            }
          }
        }
      ]
    );
  };

  const renderResumeCard = ({ item: resume }: { item: SavedResume }) => (
    <TouchableOpacity
      style={[styles.resumeCard, { backgroundColor: colors.surface }]}
      onPress={() => handleResumePress(resume)}
      activeOpacity={0.8}
    >
      <View style={styles.cardPreview}>
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          style={styles.previewGradient}
        >
          <Ionicons name="document-text" size={32} color="white" />
        </LinearGradient>
      </View>
      
      <View style={styles.cardContent}>
        <Text style={[styles.resumeTitle, { color: colors.text }]} numberOfLines={2}>
          {resume.title}
        </Text>
        
        <View style={styles.resumeMeta}>
          <View style={styles.metaItem}>
            <Ionicons name="calendar-outline" size={12} color={colors.textMuted} />
            <Text style={[styles.metaText, { color: colors.textMuted }]}>
              {new Date(resume.updated_at).toLocaleDateString('pt-BR')}
            </Text>
          </View>
          
          <View style={styles.metaItem}>
            <Ionicons name="download-outline" size={12} color={colors.textMuted} />
            <Text style={[styles.metaText, { color: colors.textMuted }]}>
              {resume.download_count}
            </Text>
          </View>
        </View>

        <View style={styles.cardActions}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.primary + '15' }]}
            onPress={() => handleDownload(resume)}
          >
            <Ionicons name="download" size={14} color={colors.primary} />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.primary + '15' }]}
            onPress={() => handleShare(resume)}
          >
            <Ionicons name="share-outline" size={14} color={colors.primary} />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#ef444415' }]}
            onPress={() => handleDeleteResume(resume)}
          >
            <Ionicons name="trash-outline" size={14} color="#ef4444" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderTemplateCard = ({ item: template }: { item: ResumeTemplate }) => (
    <TouchableOpacity
      style={[styles.templateCard, { backgroundColor: colors.surface }]}
      onPress={() => handleTemplatePress(template)}
      activeOpacity={0.8}
    >
      <View style={styles.templatePreview}>
        <LinearGradient
          colors={[
            template.template_data.colors.primary,
            template.template_data.colors.secondary
          ]}
          style={styles.templateGradient}
        >
          <Ionicons name="document-outline" size={28} color="white" />
        </LinearGradient>
        
        {template.is_premium && (
          <View style={styles.premiumBadge}>
            <Ionicons name="diamond" size={10} color="#fbbf24" />
          </View>
        )}
      </View>
      
      <View style={styles.templateInfo}>
        <Text style={[styles.templateName, { color: colors.text }]} numberOfLines={2}>
          {template.name}
        </Text>
        <Text style={[styles.templateCategory, { color: colors.textMuted }]}>
          {template.category}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderStatsCard = () => (
    <View style={[styles.statsCard, { backgroundColor: colors.surface }]}>
      <Text style={[styles.statsTitle, { color: colors.text }]}>Estatísticas</Text>
      
      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: colors.primary }]}>
            {stats?.totalResumes || 0}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textMuted }]}>Currículos</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: '#10b981' }]}>
            {stats?.totalDownloads || 0}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textMuted }]}>Downloads</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: '#f59e0b' }]}>
            {stats?.totalShares || 0}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textMuted }]}>Shares</Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, { color: '#8b5cf6' }]}>
            {stats?.completedResumes || 0}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textMuted }]}>Completos</Text>
        </View>
      </View>
    </View>
  );

  const renderTabButton = (tab: 'my-resumes' | 'templates', title: string, icon: string) => (
    <TouchableOpacity
      style={[
        styles.tabButton,
        { backgroundColor: activeTab === tab ? colors.primary : 'transparent' }
      ]}
      onPress={() => setActiveTab(tab)}
    >
      <Ionicons
        name={icon as any}
        size={20}
        color={activeTab === tab ? 'white' : colors.textMuted}
      />
      <Text
        style={[
          styles.tabText,
          {
            color: activeTab === tab ? 'white' : colors.textMuted,
            fontWeight: activeTab === tab ? '600' : '400'
          }
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <UniversalHeader title="Meus Currículos" showBackButton={true} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textMuted }]}>
            Carregando currículos...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <UniversalHeader title="Meus Currículos" showBackButton={true} />
      
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Stats Card */}
        {stats && renderStatsCard()}

        {/* Tab Navigation */}
        <View style={[styles.tabContainer, { backgroundColor: colors.surface }]}>
          {renderTabButton('my-resumes', 'Meus Currículos', 'document-text')}
          {renderTabButton('templates', 'Templates', 'apps')}
        </View>

        {/* Create New Resume Button */}
        <TouchableOpacity
          style={[styles.createButton, { backgroundColor: colors.primary }]}
          onPress={handleCreateNewResume}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={20} color="white" />
          <Text style={styles.createButtonText}>Criar Novo Currículo</Text>
        </TouchableOpacity>

        {/* Content */}
        {activeTab === 'my-resumes' ? (
          <>
            {resumes.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="document-outline" size={64} color={colors.textMuted} />
                <Text style={[styles.emptyTitle, { color: colors.text }]}>
                  Nenhum currículo encontrado
                </Text>
                <Text style={[styles.emptyText, { color: colors.textMuted }]}>
                  Comece criando seu primeiro currículo profissional
                </Text>
                <TouchableOpacity
                  style={[styles.emptyButton, { backgroundColor: colors.primary }]}
                  onPress={handleCreateNewResume}
                >
                  <Text style={styles.emptyButtonText}>Criar Primeiro Currículo</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <FlatList
                data={resumes}
                renderItem={renderResumeCard}
                keyExtractor={item => item.id}
                numColumns={2}
                contentContainerStyle={styles.resumesList}
                columnWrapperStyle={styles.row}
                scrollEnabled={false}
              />
            )}
          </>
        ) : (
          <FlatList
            data={templates}
            renderItem={renderTemplateCard}
            keyExtractor={item => item.id}
            numColumns={2}
            contentContainerStyle={styles.templatesList}
            columnWrapperStyle={styles.row}
            scrollEnabled={false}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
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
  statsCard: {
    margin: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  tabContainer: {
    flexDirection: 'row',
    margin: 16,
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    gap: 8,
  },
  tabText: {
    fontSize: 14,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 16,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  resumesList: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  templatesList: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
  },
  resumeCard: {
    width: CARD_WIDTH,
    marginBottom: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardPreview: {
    height: 120,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: 'hidden',
  },
  previewGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    padding: 12,
  },
  resumeTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    minHeight: 34, // Para manter altura consistente
  },
  resumeMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 11,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  templateCard: {
    width: CARD_WIDTH,
    marginBottom: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  templatePreview: {
    height: 100,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  templateGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  premiumBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  templateInfo: {
    padding: 12,
  },
  templateName: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
  },
  templateCategory: {
    fontSize: 11,
    textTransform: 'capitalize',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    marginTop: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  emptyButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});