
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Modal,
  Alert,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { updateProfile, signOut } from '../../store/slices/authSlice';
import { fetchProfile, fetchProfileStats, updateProfile as updateUserProfile, updateCurrentProfile } from '../../store/slices/profileSlice';
import PersonaSelector from '../../components/PersonaSelector';
import { PERSONAS, Persona, getPersonaById, getPersonaImage } from '../../utils/personas';

const { width } = Dimensions.get('window');

interface Skill {
  name: string;
  level: 'Iniciante' | 'Intermediário' | 'Avançado' | 'Expert';
}

export default function ProfileScreen({ navigation }: any) {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { currentProfile, profileStats, loading, updating } = useSelector((state: RootState) => state.profile);

  const [editMode, setEditMode] = useState(false);
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [showPersonaSelector, setShowPersonaSelector] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    name: user?.name || '',
    occupation: user?.occupation || '',
    company: user?.company || '',
    location: user?.location || '',
    bio: user?.bio || '',
    persona_id: user?.persona_id || null,
    skills: user?.skills || [],
  });

  const [newSkill, setNewSkill] = useState({ name: '', level: 'Intermediário' as const });

  // Load profile data when component mounts or user changes
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchProfile(user.id));
      dispatch(fetchProfileStats(user.id));
    }
  }, [dispatch, user?.id]);

  // Update editedProfile when currentProfile changes
  useEffect(() => {
    if (currentProfile) {
      setEditedProfile({
        name: currentProfile.name || '',
        occupation: currentProfile.occupation || '',
        company: currentProfile.company || '',
        location: currentProfile.location || '',
        bio: currentProfile.bio || '',
        persona_id: currentProfile.persona_id || null,
        skills: currentProfile.skills?.map(skill => ({
          name: skill.name,
          level: skill.level === 'beginner' ? 'Iniciante' :
                skill.level === 'intermediate' ? 'Intermediário' :
                skill.level === 'advanced' ? 'Avançado' : 'Expert'
        })) || [],
      });
    }
  }, [currentProfile]);

  const profileStatsData = [
    { 
      label: 'Posts', 
      value: profileStats?.posts_count?.toString() || '0', 
      icon: 'newspaper-outline' 
    },
    { 
      label: 'Conexões', 
      value: profileStats?.connections_count?.toString() || '0', 
      icon: 'people-outline' 
    },
    { 
      label: 'Projetos', 
      value: profileStats?.projects_count?.toString() || '0', 
      icon: 'code-slash-outline' 
    },
    { 
      label: 'Visualizações', 
      value: profileStats?.views_count?.toString() || '0', 
      icon: 'eye-outline' 
    },
  ];

  const quickActions = [
    {
      icon: 'create-outline',
      title: 'Editar Perfil',
      subtitle: 'Alterar informações',
      color: '#3b82f6',
      onPress: () => setEditMode(true),
    },
    {
      icon: 'people-outline',
      title: 'Conexões',
      subtitle: `${profileStats?.connections_count || 0} desenvolvedores`,
      color: '#10b981',
      onPress: () => navigation.navigate('Connections'),
    },
    {
      icon: 'bookmark-outline',
      title: 'Salvos',
      subtitle: 'Posts salvos',
      color: '#f59e0b',
      onPress: () => navigation.navigate('SavedPosts'),
    },
    {
      icon: 'settings-outline',
      title: 'Configurações',
      subtitle: 'Conta e privacidade',
      color: '#6b7280',
      onPress: () => navigation.navigate('Settings'),
    },
  ];

  const handleSaveProfile = async () => {
    if (!user?.id) return;
    
    try {
      // Convert skills format back to database format
      const skillsForDatabase = editedProfile.skills.map(skill => ({
        name: skill.name,
        level: skill.level === 'Iniciante' ? 'beginner' :
               skill.level === 'Intermediário' ? 'intermediate' :
               skill.level === 'Avançado' ? 'advanced' : 'expert',
        category: 'technical' as const
      }));

      const profileUpdate = {
        name: editedProfile.name,
        occupation: editedProfile.occupation,
        company: editedProfile.company,
        location: editedProfile.location,
        bio: editedProfile.bio,
        persona_id: editedProfile.persona_id,
      };

      await dispatch(updateUserProfile({ userId: user.id, updates: profileUpdate })).unwrap();
      
      // Also update auth state to keep them in sync
      await dispatch(updateProfile(editedProfile)).unwrap();
      
      setEditMode(false);
      Alert.alert('Sucesso!', 'Perfil atualizado com sucesso!');
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao atualizar perfil');
    }
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair da sua conta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Sair', 
          style: 'destructive',
          onPress: () => dispatch(signOut())
        },
      ]
    );
  };

  const handleSelectPersona = (persona: Persona) => {
    setEditedProfile({ 
      ...editedProfile, 
      persona_id: persona.id
    });
    setShowPersonaSelector(false);
  };

  const addSkill = () => {
    if (!newSkill.name.trim()) return;
    
    setEditedProfile({
      ...editedProfile,
      skills: [...editedProfile.skills, newSkill]
    });
    setNewSkill({ name: '', level: 'Intermediário' });
    setShowSkillModal(false);
  };

  const removeSkill = (index: number) => {
    setEditedProfile({
      ...editedProfile,
      skills: editedProfile.skills.filter((_, i) => i !== index)
    });
  };

  const getSkillColor = (level: string) => {
    switch (level) {
      case 'Iniciante': return '#10b981';
      case 'Intermediário': return '#3b82f6';
      case 'Avançado': return '#f59e0b';
      case 'Expert': return '#ef4444';
      default: return '#6b7280';
    }
  };

  // Função para obter a imagem de perfil (usa apenas personas)
  const getProfileImage = (profile?: any, fallbackName?: string) => {
    if (profile?.persona_id) {
      const personaImage = getPersonaImage(profile.persona_id);
      if (personaImage) {
        return personaImage;
      }
    }
    // Fallback para avatar gerado quando não há persona selecionada
    return { 
      uri: `https://ui-avatars.com/api/?name=${encodeURIComponent(fallbackName || 'User')}&background=2563eb&color=fff` 
    };
  };

  if (editMode) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.editHeader}>
          <TouchableOpacity onPress={() => setEditMode(false)}>
            <Text style={styles.cancelButton}>Cancelar</Text>
          </TouchableOpacity>
          <Text style={styles.editTitle}>Editar Perfil</Text>
          <TouchableOpacity onPress={handleSaveProfile}>
            <Text style={styles.saveButton}>Salvar</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.editContent}>
          {/* Avatar */}
          <View style={styles.editAvatarSection}>
            <TouchableOpacity onPress={() => setShowPersonaSelector(true)} style={styles.editAvatarContainer}>
              <Image
                source={getProfileImage(editedProfile, editedProfile.name)}
                style={styles.editAvatar}
              />
              <View style={styles.editAvatarOverlay}>
                <Ionicons name="happy-outline" size={24} color="white" />
              </View>
            </TouchableOpacity>
            
            <Text style={styles.avatarSectionTitle}>Persona do Perfil</Text>
            <Text style={styles.avatarSectionSubtitle}>
              Selecione uma persona animal para representar seu perfil
            </Text>
            
            <TouchableOpacity 
              style={styles.selectPersonaButton} 
              onPress={() => setShowPersonaSelector(true)}
            >
              <Ionicons name="happy-outline" size={20} color="#10b981" />
              <Text style={styles.selectPersonaText}>
                {editedProfile.persona_id ? 'Alterar Persona' : 'Escolher Persona'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Form Fields */}
          <View style={styles.editForm}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nome</Text>
              <TextInput
                style={styles.input}
                value={editedProfile.name}
                onChangeText={(text) => setEditedProfile({ ...editedProfile, name: text })}
                placeholder="Seu nome completo"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Ocupação</Text>
              <TextInput
                style={styles.input}
                value={editedProfile.occupation}
                onChangeText={(text) => setEditedProfile({ ...editedProfile, occupation: text })}
                placeholder="Ex: Desenvolvedor Full Stack"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Empresa</Text>
              <TextInput
                style={styles.input}
                value={editedProfile.company}
                onChangeText={(text) => setEditedProfile({ ...editedProfile, company: text })}
                placeholder="Ex: Google, Freelancer, etc."
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Localização</Text>
              <TextInput
                style={styles.input}
                value={editedProfile.location}
                onChangeText={(text) => setEditedProfile({ ...editedProfile, location: text })}
                placeholder="Ex: São Paulo, SP"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Bio</Text>
              <TextInput
                style={[styles.input, styles.bioInput]}
                value={editedProfile.bio}
                onChangeText={(text) => setEditedProfile({ ...editedProfile, bio: text })}
                placeholder="Conte um pouco sobre você..."
                multiline
                numberOfLines={4}
              />
            </View>

            {/* Skills */}
            <View style={styles.inputGroup}>
              <View style={styles.skillsHeader}>
                <Text style={styles.inputLabel}>Habilidades</Text>
                <TouchableOpacity onPress={() => setShowSkillModal(true)}>
                  <Ionicons name="add-circle-outline" size={24} color="#3b82f6" />
                </TouchableOpacity>
              </View>
              <View style={styles.skillsList}>
                {editedProfile.skills.map((skill, index) => (
                  <View key={index} style={styles.skillTag}>
                    <Text style={styles.skillName}>{skill.name}</Text>
                    <Text style={[styles.skillLevel, { color: getSkillColor(skill.level) }]}>
                      {skill.level}
                    </Text>
                    <TouchableOpacity onPress={() => removeSkill(index)}>
                      <Ionicons name="close" size={16} color="#6b7280" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Add Skill Modal */}
        <Modal visible={showSkillModal} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.skillModal}>
              <Text style={styles.modalTitle}>Adicionar Habilidade</Text>
              
              <TextInput
                style={styles.input}
                value={newSkill.name}
                onChangeText={(text) => setNewSkill({ ...newSkill, name: text })}
                placeholder="Nome da habilidade"
                autoFocus
              />

              <View style={styles.levelSelector}>
                {['Iniciante', 'Intermediário', 'Avançado', 'Expert'].map((level) => (
                  <TouchableOpacity
                    key={level}
                    style={[
                      styles.levelOption,
                      newSkill.level === level && styles.levelOptionSelected
                    ]}
                    onPress={() => setNewSkill({ ...newSkill, level: level as any })}
                  >
                    <Text style={[
                      styles.levelText,
                      newSkill.level === level && styles.levelTextSelected
                    ]}>
                      {level}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.modalCancelButton}
                  onPress={() => setShowSkillModal(false)}
                >
                  <Text style={styles.modalCancelText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalAddButton}
                  onPress={addSkill}
                >
                  <Text style={styles.modalAddText}>Adicionar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Persona Selector */}
        <PersonaSelector
          visible={showPersonaSelector}
          onClose={() => setShowPersonaSelector(false)}
          onSelectPersona={handleSelectPersona}
          currentPersonaId={editedProfile.persona_id}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={['#3b82f6', '#8b5cf6']}
          style={styles.profileHeader}
        >
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerButton}>
              <Ionicons name="share-outline" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton} onPress={handleSignOut}>
              <Ionicons name="log-out-outline" size={24} color="white" />
            </TouchableOpacity>
          </View>

          <View style={styles.profileInfo}>
            {loading && !currentProfile ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="white" />
                <Text style={styles.loadingText}>Carregando perfil...</Text>
              </View>
            ) : (
              <>
                <Image
                  source={getProfileImage(currentProfile || user, currentProfile?.name || user?.name || 'User')}
                  style={styles.profileAvatar}
                />
                <Text style={styles.profileName}>{currentProfile?.name || user?.name}</Text>
                <Text style={styles.profileOccupation}>
                  {currentProfile?.occupation || user?.occupation || 'Desenvolvedor'}
                </Text>
                <Text style={styles.profileCompany}>
                  {(currentProfile?.company || user?.company) && `@ ${currentProfile?.company || user?.company}`}
                </Text>
                <View style={styles.profileLocation}>
                  <Ionicons name="location-outline" size={16} color="rgba(255, 255, 255, 0.8)" />
                  <Text style={styles.profileLocationText}>
                    {currentProfile?.location || user?.location || 'Localização não informada'}
                  </Text>
                </View>
              </>
            )}
          </View>
        </LinearGradient>

        {/* Stats */}
        <View style={styles.statsContainer}>
          {profileStatsData.map((stat, index) => (
            <View key={index} style={styles.statItem}>
              <Ionicons name={stat.icon as any} size={24} color="#3b82f6" />
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Bio */}
        {(currentProfile?.bio || user?.bio) && (
          <View style={styles.bioSection}>
            <Text style={styles.sectionTitle}>Sobre</Text>
            <Text style={styles.bioText}>{currentProfile?.bio || user?.bio}</Text>
          </View>
        )}

        {/* Skills */}
        {currentProfile?.skills && currentProfile.skills.length > 0 && (
          <View style={styles.skillsSection}>
            <Text style={styles.sectionTitle}>Habilidades</Text>
            <View style={styles.skillsContainer}>
              {currentProfile.skills.map((skill, index) => (
                <View key={index} style={styles.skillItem}>
                  <Text style={styles.skillItemName}>{skill.name}</Text>
                  <View style={[styles.skillBadge, { backgroundColor: getSkillColor(skill.level) }]}>
                    <Text style={styles.skillBadgeText}>{skill.level}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Ações Rápidas</Text>
          <View style={styles.actionsContainer}>
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={styles.actionItem}
                onPress={action.onPress}
              >
                <View style={[styles.actionIcon, { backgroundColor: `${action.color}15` }]}>
                  <Ionicons name={action.icon as any} size={24} color={action.color} />
                </View>
                <View style={styles.actionContent}>
                  <Text style={styles.actionTitle}>{action.title}</Text>
                  <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.activitySection}>
          <Text style={styles.sectionTitle}>Atividade Recente</Text>
          <View style={styles.emptyActivity}>
            <Ionicons name="pulse-outline" size={48} color="#9ca3af" />
            <Text style={styles.emptyActivityText}>Nenhuma atividade recente</Text>
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
  },
  profileLocationText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginTop: -20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  bioSection: {
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  bioText: {
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
  skillsContainer: {
    gap: 12,
  },
  skillItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  skillItemName: {
    fontSize: 16,
    color: '#1f2937',
    flex: 1,
  },
  skillBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  skillBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  actionsSection: {
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
  actionsContainer: {
    gap: 16,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  actionSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  activitySection: {
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
  emptyActivity: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyActivityText: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 8,
  },
  // Edit Mode Styles
  editHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  cancelButton: {
    fontSize: 16,
    color: '#6b7280',
  },
  editTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  saveButton: {
    fontSize: 16,
    color: '#3b82f6',
    fontWeight: 'bold',
  },
  editContent: {
    flex: 1,
  },
  editAvatarSection: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: 'white',
    marginBottom: 16,
  },
  avatarSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 16,
    marginBottom: 4,
  },
  avatarSectionSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 20,
  },
  selectPersonaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#f0fdf4',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#10b981',
    gap: 8,
    marginTop: 8,
  },
  selectPersonaText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10b981',
  },
  editAvatarContainer: {
    position: 'relative',
  },
  editAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  editAvatarOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
  },
  editForm: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1f2937',
  },
  bioInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  skillsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skillsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  skillTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  skillName: {
    fontSize: 14,
    color: '#1f2937',
    fontWeight: '500',
  },
  skillLevel: {
    fontSize: 12,
    fontWeight: '600',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  skillModal: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 20,
    textAlign: 'center',
  },
  levelSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 16,
    marginBottom: 24,
  },
  levelOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  levelOptionSelected: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  levelText: {
    fontSize: 14,
    color: '#6b7280',
  },
  levelTextSelected: {
    color: 'white',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '600',
  },
  modalAddButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
  },
  modalAddText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    color: 'white',
    fontSize: 16,
    marginTop: 16,
    fontWeight: '500',
  },
});
