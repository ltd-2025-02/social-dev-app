import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Linking,
  Alert,
  RefreshControl
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { enhancedProfileService, ExtendedUserProfile, ExtendedProfileSkill } from '../../services/profile.service.enhanced';
import { getPersonaImage } from '../../utils/personas';
import { getTechnologyIcon, CATEGORY_NAMES, TechnologyIcon } from '../../utils/technologyIcons';
import TechnologySelector from '../../components/TechnologySelector';

const { width } = Dimensions.get('window');

interface EnhancedProfileScreenProps {
  navigation: any;
  route?: { params?: { userId?: string } };
}

export default function EnhancedProfileScreen({ navigation, route }: EnhancedProfileScreenProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [profile, setProfile] = useState<ExtendedUserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showTechnologySelector, setShowTechnologySelector] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('about');

  const isOwnProfile = !route?.params?.userId || route.params.userId === user?.id;
  const profileUserId = route?.params?.userId || user?.id;

  useEffect(() => {
    if (profileUserId) {
      loadProfile();
    }
  }, [profileUserId]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const profileData = await enhancedProfileService.getCompleteProfile(profileUserId);
      setProfile(profileData);
    } catch (error) {
      console.error('Error loading profile:', error);
      Alert.alert('Erro', 'Não foi possível carregar o perfil');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadProfile();
    setRefreshing(false);
  };

  const handleOpenUrl = (url: string | null) => {
    if (!url) return;
    
    let fullUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      fullUrl = `https://${url}`;
    }
    
    Linking.openURL(fullUrl).catch(() => {
      Alert.alert('Erro', 'Não foi possível abrir o link');
    });
  };

  const handleAddTechnology = async (technology: TechnologyIcon, level: 'beginner' | 'intermediate' | 'advanced' | 'expert') => {
    if (!profileUserId) return;
    
    try {
      const technologyIcon = getTechnologyIcon(technology.id);
      
      await enhancedProfileService.addProfileSkill(profileUserId, {
        name: technology.name,
        level,
        category: 'technical',
        icon_name: technology.icon,
        color: technology.color,
        is_featured: false
      });
      
      await loadProfile(); // Recarregar perfil
      Alert.alert('Sucesso!', `${technology.name} adicionado às suas habilidades`);
    } catch (error) {
      console.error('Error adding technology:', error);
      Alert.alert('Erro', 'Não foi possível adicionar a tecnologia');
    }
  };

  const getProfileImage = (): any => {
    if (profile?.avatar && profile.avatar.startsWith('persona:')) {
      const personaId = profile.avatar.replace('persona:', '');
      const personaImage = getPersonaImage(personaId);
      if (personaImage) return personaImage;
    }
    
    if (profile?.avatar && !profile.avatar.startsWith('persona:')) {
      return { uri: profile.avatar };
    }
    
    return { 
      uri: `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.name || 'User')}&background=2563eb&color=fff` 
    };
  };

  const renderHeader = () => (
    <LinearGradient colors={['#3b82f6', '#8b5cf6']} style={styles.profileHeader}>
      <View style={styles.headerActions}>
        {!isOwnProfile && (
          <TouchableOpacity style={styles.headerButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
        )}
        {profile?.resume_url && (
          <TouchableOpacity 
            style={styles.headerButton} 
            onPress={() => handleOpenUrl(profile.resume_url)}
          >
            <Ionicons name="document-text-outline" size={24} color="white" />
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.headerButton}>
          <Ionicons name="share-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.profileInfo}>
        <Image source={getProfileImage()} style={styles.profileAvatar} />
        <Text style={styles.profileName}>{profile?.name}</Text>
        <Text style={styles.profileOccupation}>{profile?.occupation || 'Desenvolvedor'}</Text>
        {profile?.company && (
          <Text style={styles.profileCompany}>@ {profile.company}</Text>
        )}
        <View style={styles.profileLocation}>
          <Ionicons name="location-outline" size={16} color="rgba(255, 255, 255, 0.8)" />
          <Text style={styles.profileLocationText}>
            {profile?.location || 'Localização não informada'}
          </Text>
        </View>
        
        {/* Completion Percentage */}
        {isOwnProfile && (
          <View style={styles.completionContainer}>
            <Text style={styles.completionText}>
              Perfil {profile?.profile_completion_percentage || 0}% completo
            </Text>
            <View style={styles.completionBar}>
              <View 
                style={[
                  styles.completionBarFill, 
                  { width: `${profile?.profile_completion_percentage || 0}%` }
                ]} 
              />
            </View>
          </View>
        )}
      </View>
    </LinearGradient>
  );

  const renderSocialLinks = () => {
    const socialLinks = [
      { key: 'github_url', icon: 'logo-github', label: 'GitHub', url: profile?.github_url },
      { key: 'linkedin_url', icon: 'logo-linkedin', label: 'LinkedIn', url: profile?.linkedin_url },
      { key: 'indeed_url', icon: 'briefcase-outline', label: 'Indeed', url: profile?.indeed_url },
      { key: 'portfolio_url', icon: 'globe-outline', label: 'Portfolio', url: profile?.portfolio_url },
      { key: 'twitter_url', icon: 'logo-twitter', label: 'Twitter', url: profile?.twitter_url },
      { key: 'website', icon: 'link-outline', label: 'Website', url: profile?.website },
    ].filter(link => link.url);

    if (socialLinks.length === 0) return null;

    return (
      <View style={styles.socialLinksContainer}>
        <Text style={styles.sectionTitle}>Redes Sociais</Text>
        <View style={styles.socialLinksGrid}>
          {socialLinks.map((link) => (
            <TouchableOpacity
              key={link.key}
              style={styles.socialLinkItem}
              onPress={() => handleOpenUrl(link.url)}
            >
              <Ionicons name={link.icon as any} size={20} color="#3b82f6" />
              <Text style={styles.socialLinkText}>{link.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  const renderDescription = () => {
    if (!profile?.description && !profile?.bio) return null;

    return (
      <View style={styles.descriptionSection}>
        <Text style={styles.sectionTitle}>Sobre</Text>
        <Text style={styles.descriptionText}>
          {profile.description || profile.bio}
        </Text>
      </View>
    );
  };

  const renderSkills = () => {
    if (!profile?.skills || profile.skills.length === 0) {
      if (!isOwnProfile) return null;

      return (
        <View style={styles.skillsSection}>
          <View style={styles.skillsHeader}>
            <Text style={styles.sectionTitle}>Competências</Text>
            <TouchableOpacity onPress={() => setShowTechnologySelector(true)}>
              <Ionicons name="add-circle-outline" size={24} color="#3b82f6" />
            </TouchableOpacity>
          </View>
          <View style={styles.emptySkills}>
            <Ionicons name="code-slash-outline" size={48} color="#9ca3af" />
            <Text style={styles.emptySkillsText}>Adicione suas tecnologias e competências</Text>
            <TouchableOpacity 
              style={styles.addSkillButton}
              onPress={() => setShowTechnologySelector(true)}
            >
              <Text style={styles.addSkillButtonText}>Adicionar primeira competência</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    // Agrupar skills por categoria
    const skillsByCategory = profile.skills.reduce((acc, skill) => {
      if (!acc[skill.category]) acc[skill.category] = [];
      acc[skill.category].push(skill);
      return acc;
    }, {} as Record<string, ExtendedProfileSkill[]>);

    return (
      <View style={styles.skillsSection}>
        <View style={styles.skillsHeader}>
          <Text style={styles.sectionTitle}>Competências</Text>
          {isOwnProfile && (
            <TouchableOpacity onPress={() => setShowTechnologySelector(true)}>
              <Ionicons name="add-circle-outline" size={24} color="#3b82f6" />
            </TouchableOpacity>
          )}
        </View>

        {Object.entries(skillsByCategory).map(([category, skills]) => (
          <View key={category} style={styles.skillCategory}>
            <Text style={styles.skillCategoryTitle}>
              {CATEGORY_NAMES[category as keyof typeof CATEGORY_NAMES] || category}
            </Text>
            <View style={styles.skillsGrid}>
              {skills.map((skill) => {
                const technologyIcon = skill.icon_name ? getTechnologyIcon(skill.icon_name) : null;
                
                return (
                  <View key={skill.id} style={styles.skillItem}>
                    <View style={styles.skillContent}>
                      {technologyIcon && (
                        <View style={[
                          styles.skillIcon, 
                          { backgroundColor: `${skill.color || technologyIcon.color}15` }
                        ]}>
                          <Ionicons 
                            name={technologyIcon.icon as any} 
                            size={18} 
                            color={skill.color || technologyIcon.color} 
                          />
                        </View>
                      )}
                      <View style={styles.skillTextContainer}>
                        <Text style={styles.skillName}>{skill.name}</Text>
                        <Text style={[styles.skillLevel, { color: getLevelColor(skill.level) }]}>
                          {getLevelLabel(skill.level)}
                        </Text>
                      </View>
                    </View>
                    {skill.endorsements && skill.endorsements.length > 0 && (
                      <Text style={styles.endorsementCount}>
                        {skill.endorsements.length} {skill.endorsements.length === 1 ? 'endorsement' : 'endorsements'}
                      </Text>
                    )}
                  </View>
                );
              })}
            </View>
          </View>
        ))}
      </View>
    );
  };

  const renderExperiences = () => {
    if (!profile?.experiences || profile.experiences.length === 0) return null;

    return (
      <View style={styles.experiencesSection}>
        <Text style={styles.sectionTitle}>Experiência</Text>
        {profile.experiences.map((experience) => (
          <View key={experience.id} style={styles.experienceItem}>
            <View style={styles.experienceHeader}>
              <View style={styles.experienceIcon}>
                <Ionicons name="briefcase-outline" size={20} color="#3b82f6" />
              </View>
              <View style={styles.experienceContent}>
                <Text style={styles.experiencePosition}>{experience.position}</Text>
                <Text style={styles.experienceCompany}>{experience.company}</Text>
                <View style={styles.experienceDetails}>
                  <Text style={styles.experienceDate}>
                    {formatDate(experience.start_date)} - {
                      experience.is_current ? 'Presente' : formatDate(experience.end_date)
                    }
                  </Text>
                  {experience.location && (
                    <Text style={styles.experienceLocation}>• {experience.location}</Text>
                  )}
                </View>
                {experience.description && (
                  <Text style={styles.experienceDescription}>{experience.description}</Text>
                )}
              </View>
            </View>
          </View>
        ))}
      </View>
    );
  };

  const renderProjects = () => {
    if (!profile?.projects || profile.projects.length === 0) return null;

    return (
      <View style={styles.projectsSection}>
        <Text style={styles.sectionTitle}>Projetos</Text>
        {profile.projects.map((project) => (
          <View key={project.id} style={styles.projectItem}>
            <View style={styles.projectHeader}>
              <Text style={styles.projectName}>{project.name}</Text>
              <View style={styles.projectLinks}>
                {project.github_url && (
                  <TouchableOpacity onPress={() => handleOpenUrl(project.github_url)}>
                    <Ionicons name="logo-github" size={20} color="#3b82f6" />
                  </TouchableOpacity>
                )}
                {project.demo_url && (
                  <TouchableOpacity onPress={() => handleOpenUrl(project.demo_url)}>
                    <Ionicons name="open-outline" size={20} color="#3b82f6" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
            {project.description && (
              <Text style={styles.projectDescription}>{project.description}</Text>
            )}
            {project.technologies && project.technologies.length > 0 && (
              <View style={styles.projectTechnologies}>
                {project.technologies.map((tech, index) => (
                  <View key={index} style={styles.projectTechTag}>
                    <Text style={styles.projectTechText}>{tech}</Text>
                  </View>
                ))}
              </View>
            )}
            <Text style={styles.projectDate}>
              {formatDate(project.start_date)} - {
                project.is_current ? 'Presente' : formatDate(project.end_date)
              }
            </Text>
          </View>
        ))}
      </View>
    );
  };

  // Helper functions
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return '#10b981';
      case 'intermediate': return '#3b82f6';
      case 'advanced': return '#f59e0b';
      case 'expert': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getLevelLabel = (level: string) => {
    switch (level) {
      case 'beginner': return 'Iniciante';
      case 'intermediate': return 'Intermediário';
      case 'advanced': return 'Avançado';
      case 'expert': return 'Expert';
      default: return level;
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text>Carregando perfil...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!profile) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text>Perfil não encontrado</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {renderHeader()}
        {renderSocialLinks()}
        {renderDescription()}
        {renderSkills()}
        {renderExperiences()}
        {renderProjects()}
      </ScrollView>

      {/* Technology Selector Modal */}
      <TechnologySelector
        visible={showTechnologySelector}
        onClose={() => setShowTechnologySelector(false)}
        onSelectTechnology={handleAddTechnology}
        selectedTechnologies={profile?.skills?.map(skill => skill.name) || []}
      />
    </SafeAreaView>
  );
}

// Styles would continue here - keeping the existing ones and adding new ones
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileHeader: {
    paddingTop: 20,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginBottom: 20,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    alignItems: 'center',
  },
  profileAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
    borderWidth: 4,
    borderColor: 'white',
  },
  profileName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  profileOccupation: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 4,
  },
  profileCompany: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
  },
  profileLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 16,
  },
  profileLocationText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  completionContainer: {
    alignItems: 'center',
    marginTop: 8,
  },
  completionText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 8,
  },
  completionBar: {
    width: 200,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
  },
  completionBarFill: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 2,
  },
  socialLinksContainer: {
    margin: 16,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  socialLinksGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  socialLinkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
    gap: 6,
  },
  socialLinkText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  descriptionSection: {
    margin: 16,
    marginTop: 0,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#4b5563',
  },
  skillsSection: {
    margin: 16,
    marginTop: 0,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  skillsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptySkills: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptySkillsText: {
    fontSize: 16,
    color: '#9ca3af',
    marginTop: 12,
    marginBottom: 20,
    textAlign: 'center',
  },
  addSkillButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#3b82f6',
    borderRadius: 8,
  },
  addSkillButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  skillCategory: {
    marginBottom: 24,
  },
  skillCategoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  skillsGrid: {
    gap: 12,
  },
  skillItem: {
    padding: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
  },
  skillContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  skillIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  skillTextContainer: {
    flex: 1,
  },
  skillName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  skillLevel: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 2,
  },
  endorsementCount: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  experiencesSection: {
    margin: 16,
    marginTop: 0,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  experienceItem: {
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  experienceHeader: {
    flexDirection: 'row',
  },
  experienceIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  experienceContent: {
    flex: 1,
  },
  experiencePosition: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  experienceCompany: {
    fontSize: 15,
    color: '#3b82f6',
    marginTop: 2,
  },
  experienceDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 8,
  },
  experienceDate: {
    fontSize: 14,
    color: '#6b7280',
  },
  experienceLocation: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 4,
  },
  experienceDescription: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
  },
  projectsSection: {
    margin: 16,
    marginTop: 0,
    marginBottom: 32,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  projectItem: {
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  projectName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    flex: 1,
  },
  projectLinks: {
    flexDirection: 'row',
    gap: 12,
  },
  projectDescription: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
    marginBottom: 12,
  },
  projectTechnologies: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  projectTechTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#eff6ff',
    borderRadius: 6,
  },
  projectTechText: {
    fontSize: 12,
    color: '#3b82f6',
    fontWeight: '500',
  },
  projectDate: {
    fontSize: 12,
    color: '#6b7280',
  },
});