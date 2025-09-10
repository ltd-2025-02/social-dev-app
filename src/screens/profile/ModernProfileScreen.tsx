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
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { updateProfile, signOut } from '../../store/slices/authSlice';
import { fetchProfile, fetchProfileStats, updateProfile as updateUserProfile } from '../../store/slices/profileSlice';
import PersonaSelector from '../../components/PersonaSelector';
import { PERSONAS, Persona, getPersonaById, getPersonaImage } from '../../utils/personas';

const { width } = Dimensions.get('window');

interface Skill {
  name: string;
  level: 'Iniciante' | 'Intermediário' | 'Avançado' | 'Expert';
}

export default function ModernProfileScreen({ navigation }: any) {
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

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchProfile(user.id));
      dispatch(fetchProfileStats(user.id));
    }
  }, [dispatch, user?.id]);

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

  // Função para obter imagem de perfil
  const getProfileImage = (profile?: any, fallbackName?: string) => {
    // First check if persona_id is available (local state)
    if (profile?.persona_id) {
      const personaImage = getPersonaImage(profile.persona_id);
      if (personaImage) return personaImage;
    }
    
    // Then check if avatar contains persona data (from database)
    if (profile?.avatar && profile.avatar.startsWith('persona:')) {
      const personaId = profile.avatar.replace('persona:', '');
      const personaImage = getPersonaImage(personaId);
      if (personaImage) return personaImage;
    }
    
    // If avatar is a regular URL
    if (profile?.avatar && !profile.avatar.startsWith('persona:')) {
      return { uri: profile.avatar };
    }
    
    // Default fallback
    return { 
      uri: `https://ui-avatars.com/api/?name=${encodeURIComponent(fallbackName || 'User')}&background=2563eb&color=fff` 
    };
  };

  const handleSaveProfile = async () => {
    if (!user?.id) return;

    try {
      // Convert persona_id to avatar URL - the database expects avatar, not persona_id
      let avatarUrl = null;
      if (editedProfile.persona_id) {
        const personaImage = getPersonaImage(editedProfile.persona_id);
        if (personaImage) {
          // Since personas are local images, we'll store the persona_id as the avatar value
          // The frontend will handle converting it back to the image
          avatarUrl = `persona:${editedProfile.persona_id}`;
        }
      }

      const profileUpdate = {
        name: editedProfile.name,
        occupation: editedProfile.occupation,
        company: editedProfile.company,
        location: editedProfile.location,
        bio: editedProfile.bio,
        avatar: avatarUrl, // Save as avatar, not persona_id
      };

      await dispatch(updateUserProfile({ 
        userId: user.id, 
        profileData: profileUpdate 
      })).unwrap();

      // Also update auth state to keep them in sync (include both avatar and persona_id)
      dispatch(updateProfile({
        ...editedProfile,
        avatar: avatarUrl,
      }));

      Alert.alert('Sucesso!', 'Perfil atualizado com sucesso!');
      setEditMode(false);
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao atualizar perfil');
    }
  };

  const handleSelectPersona = (persona: Persona) => {
    setEditedProfile({ 
      ...editedProfile, 
      persona_id: persona.id
    });
    setShowPersonaSelector(false);
  };

  const handleLogout = () => {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair da sua conta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sair', style: 'destructive', onPress: () => dispatch(signOut()) }
      ]
    );
  };

  const addSkill = () => {
    if (newSkill.name.trim()) {
      const updatedSkills = [...editedProfile.skills, newSkill];
      setEditedProfile({ ...editedProfile, skills: updatedSkills });
      setNewSkill({ name: '', level: 'Intermediário' });
      setShowSkillModal(false);
    }
  };

  const removeSkill = (index: number) => {
    const updatedSkills = editedProfile.skills.filter((_, i) => i !== index);
    setEditedProfile({ ...editedProfile, skills: updatedSkills });
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

  const profileStatsData = [
    { label: 'Posts', value: profileStats?.posts_count || 0, icon: 'newspaper', color: '#3b82f6' },
    { label: 'Seguidores', value: profileStats?.connections_count || 0, icon: 'people', color: '#10b981' },
    { label: 'Seguindo', value: profileStats?.following_count || 0, icon: 'person-add', color: '#f59e0b' },
    { label: 'Projetos', value: profileStats?.projects_count || 0, icon: 'code-slash', color: '#8b5cf6' },
  ];


  if (loading && !currentProfile) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Perfil</Text>
            <Text style={styles.subtitle}>Carregando perfil...</Text>
          </View>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text style={styles.loadingText}>Carregando perfil...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Perfil</Text>
          <Text style={styles.subtitle}>
            {currentProfile?.name || 'Meu perfil'}
          </Text>
        </View>
        <View style={styles.headerActions}>
          {editMode && (
            <TouchableOpacity 
              style={styles.saveButton}
              onPress={handleSaveProfile}
              disabled={updating}
            >
              {updating ? (
                <ActivityIndicator size="small" color="#3b82f6" />
              ) : (
                <Ionicons name="checkmark" size={24} color="#3b82f6" />
              )}
            </TouchableOpacity>
          )}
          <TouchableOpacity 
            style={styles.settingsButton}
            onPress={editMode ? () => setEditMode(false) : () => setEditMode(true)}
          >
            <Ionicons 
              name={editMode ? "close" : "settings-outline"} 
              size={24} 
              color="#333" 
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <TouchableOpacity 
              onPress={() => editMode && setShowPersonaSelector(true)}
              style={styles.avatarWrapper}
            >
              <Image
                source={getProfileImage(editMode ? editedProfile : currentProfile, editMode ? editedProfile.name : currentProfile?.name)}
                style={styles.avatar}
              />
              {editMode && (
                <View style={styles.editAvatarOverlay}>
                  <Ionicons name="camera" size={20} color="white" />
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Profile Info Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileInfo}>
            {editMode ? (
              <View style={styles.editForm}>
                <TextInput
                  style={styles.nameInput}
                  value={editedProfile.name}
                  onChangeText={(text) => setEditedProfile({ ...editedProfile, name: text })}
                  placeholder="Seu nome"
                  placeholderTextColor="#9ca3af"
                />
                <TextInput
                  style={styles.input}
                  value={editedProfile.occupation}
                  onChangeText={(text) => setEditedProfile({ ...editedProfile, occupation: text })}
                  placeholder="Sua profissão"
                  placeholderTextColor="#9ca3af"
                />
                <TextInput
                  style={styles.input}
                  value={editedProfile.company}
                  onChangeText={(text) => setEditedProfile({ ...editedProfile, company: text })}
                  placeholder="Empresa"
                  placeholderTextColor="#9ca3af"
                />
                <TextInput
                  style={styles.input}
                  value={editedProfile.location}
                  onChangeText={(text) => setEditedProfile({ ...editedProfile, location: text })}
                  placeholder="Localização"
                  placeholderTextColor="#9ca3af"
                />
                <TextInput
                  style={[styles.input, styles.bioInput]}
                  value={editedProfile.bio}
                  onChangeText={(text) => setEditedProfile({ ...editedProfile, bio: text })}
                  placeholder="Conte um pouco sobre você..."
                  placeholderTextColor="#9ca3af"
                  multiline
                  numberOfLines={3}
                />
              </View>
            ) : (
              <View style={styles.profileDetails}>
                <Text style={styles.profileName}>{currentProfile?.name || 'Sem nome'}</Text>
                {currentProfile?.occupation && (
                  <Text style={styles.profileOccupation}>{currentProfile.occupation}</Text>
                )}
                <View style={styles.profileMeta}>
                  {currentProfile?.company && (
                    <View style={styles.metaItem}>
                      <Ionicons name="business" size={16} color="#6b7280" />
                      <Text style={styles.metaText}>{currentProfile.company}</Text>
                    </View>
                  )}
                  {currentProfile?.location && (
                    <View style={styles.metaItem}>
                      <Ionicons name="location" size={16} color="#6b7280" />
                      <Text style={styles.metaText}>{currentProfile.location}</Text>
                    </View>
                  )}
                </View>
                {currentProfile?.bio && (
                  <Text style={styles.profileBio}>{currentProfile.bio}</Text>
                )}
              </View>
            )}

            {/* Stats */}
            <View style={styles.statsContainer}>
              {profileStatsData.map((stat, index) => (
                <View key={index} style={styles.statItem}>
                  <View style={[styles.statIcon, { backgroundColor: stat.color }]}>
                    <Ionicons name={stat.icon as any} size={20} color="white" />
                  </View>
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Skills Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Habilidades</Text>
            {editMode && (
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => setShowSkillModal(true)}
              >
                <Ionicons name="add" size={20} color="#3b82f6" />
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.skillsContainer}>
            {(editMode ? editedProfile.skills : currentProfile?.skills || []).map((skill, index) => (
              <View key={index} style={styles.skillChip}>
                <Text style={styles.skillName}>{skill.name}</Text>
                <View style={[styles.skillLevel, { backgroundColor: getSkillColor(skill.level) }]}>
                  <Text style={styles.skillLevelText}>{skill.level}</Text>
                </View>
                {editMode && (
                  <TouchableOpacity onPress={() => removeSkill(index)} style={styles.removeSkillButton}>
                    <Ionicons name="close" size={16} color="#ef4444" />
                  </TouchableOpacity>
                )}
              </View>
            ))}
            {(editMode ? editedProfile.skills : currentProfile?.skills || []).length === 0 && (
              <Text style={styles.emptyText}>
                {editMode ? 'Adicione suas habilidades' : 'Nenhuma habilidade adicionada'}
              </Text>
            )}
          </View>
        </View>

        {/* Actions Section */}
        {!editMode && (
          <View style={styles.actionsSection}>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="share-outline" size={20} color="#3b82f6" />
              <Text style={styles.actionButtonText}>Compartilhar Perfil</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="download-outline" size={20} color="#3b82f6" />
              <Text style={styles.actionButtonText}>Exportar CV</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.actionButton, styles.logoutButton]} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={20} color="#ef4444" />
              <Text style={[styles.actionButtonText, styles.logoutText]}>Sair da Conta</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Modals */}
      <PersonaSelector
        visible={showPersonaSelector}
        onClose={() => setShowPersonaSelector(false)}
        onSelectPersona={handleSelectPersona}
        currentPersonaId={editedProfile.persona_id}
      />

      {/* Skill Modal */}
      <Modal
        visible={showSkillModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowSkillModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nova Habilidade</Text>
            <TextInput
              style={styles.modalInput}
              value={newSkill.name}
              onChangeText={(text) => setNewSkill({ ...newSkill, name: text })}
              placeholder="Nome da habilidade"
              placeholderTextColor="#9ca3af"
            />
            <View style={styles.levelSelector}>
              {['Iniciante', 'Intermediário', 'Avançado', 'Expert'].map((level) => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.levelOption,
                    newSkill.level === level && styles.selectedLevel
                  ]}
                  onPress={() => setNewSkill({ ...newSkill, level: level as any })}
                >
                  <Text style={[
                    styles.levelOptionText,
                    newSkill.level === level && styles.selectedLevelText
                  ]}>
                    {level}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowSkillModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.addSkillButton]}
                onPress={addSkill}
              >
                <Text style={styles.addSkillButtonText}>Adicionar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loadingContainer: {
    backgroundColor: 'white',
    padding: 32,
    borderRadius: 16,
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 60,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
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
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
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
  saveButton: {
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  profileHeader: {
    backgroundColor: 'white',
    padding: 32,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarContainer: {
    alignItems: 'center',
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  editAvatarOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  profileCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  profileInfo: {
    padding: 28,
  },
  editForm: {
    justifyContent: 'space-between',
    alignItems: 'stretch',
  },
  nameInput: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    borderBottomWidth: 2,
    borderBottomColor: '#3b82f6',
    paddingBottom: 8,
    textAlign: 'center',
  },
  input: {
    fontSize: 16,
    color: '#1f2937',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f9fafb',
  },
  bioInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  profileDetails: {
    alignItems: 'center',
    marginBottom: 24,
  },
  profileName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  profileOccupation: {
    fontSize: 18,
    color: '#6b7280',
    marginBottom: 12,
  },
  profileMeta: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
  },
  metaText: {
    fontSize: 14,
    color: '#6b7280',
  },
  profileBio: {
    fontSize: 16,
    color: '#4b5563',
    textAlign: 'center',
    lineHeight: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  statItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
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
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  skillChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  skillName: {
    fontSize: 14,
    color: '#1f2937',
    fontWeight: '500',
  },
  skillLevel: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  skillLevelText: {
    fontSize: 10,
    color: 'white',
    fontWeight: 'bold',
  },
  removeSkillButton: {
    padding: 2,
  },
  emptyText: {
    fontSize: 14,
    color: '#9ca3af',
    fontStyle: 'italic',
  },
  actionsSection: {
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  actionButtonText: {
    fontSize: 16,
    color: '#3b82f6',
    fontWeight: '500',
  },
  logoutButton: {
    borderWidth: 1,
    borderColor: '#fecaca',
    backgroundColor: '#fef2f2',
  },
  logoutText: {
    color: '#ef4444',
  },
  bottomSpacing: {
    height: 50,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    width: width - 40,
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalInput: {
    fontSize: 16,
    color: '#1f2937',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f9fafb',
    marginBottom: 20,
  },
  levelSelector: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  levelOption: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
  },
  selectedLevel: {
    backgroundColor: '#3b82f6',
  },
  levelOptionText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  selectedLevelText: {
    color: 'white',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f3f4f6',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
  },
  addSkillButton: {
    backgroundColor: '#3b82f6',
  },
  addSkillButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '500',
  },
});