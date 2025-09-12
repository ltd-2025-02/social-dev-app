import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
  RefreshControl,
  ActivityIndicator,
  Modal,
  TextInput,
  ActionSheetIOS,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import * as ImagePicker from 'expo-image-picker';
import { SavedResume, savedResumeService } from '../../services/savedResume.service';

const { width } = Dimensions.get('window');

interface EnhancedProfileScreenProps {
  navigation: any;
  route?: { params?: { userId?: string } };
}

export default function EnhancedProfileScreen({ navigation, route }: EnhancedProfileScreenProps) {
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showTechnologySelector, setShowTechnologySelector] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingField, setEditingField] = useState('');
  const [editingValue, setEditingValue] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [savedResumes, setSavedResumes] = useState<SavedResume[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(false);
  
  const dispatch = useDispatch();

  const isOwnProfile = !route?.params?.userId || route.params.userId === user?.id;
  const profileUserId = route?.params?.userId || user?.id;

  const onRefresh = async () => {
    setRefreshing(true);
    await loadSavedResumes();
    setTimeout(() => setRefreshing(false), 1000);
  };

  const loadSavedResumes = async () => {
    if (!user?.id) return;
    
    try {
      setLoadingResumes(true);
      const resumes = await savedResumeService.getUserResumes(user.id);
      setSavedResumes(resumes);
    } catch (error) {
      console.error('Error loading saved resumes:', error);
    } finally {
      setLoadingResumes(false);
    }
  };

  useEffect(() => {
    if (user?.id && isOwnProfile) {
      loadSavedResumes();
    }
  }, [user?.id, isOwnProfile]);

  const getProfileImage = (): any => {
    return { 
      uri: `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=2563eb&color=fff` 
    };
  };

  const handleAddTechnology = () => {
    setShowTechnologySelector(true);
  };

  const handleEditPhoto = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permissão necessária', 'Precisamos de permissão para acessar sua galeria de fotos.');
        return;
      }

      if (Platform.OS === 'ios') {
        ActionSheetIOS.showActionSheetWithOptions(
          {
            options: ['Cancelar', 'Escolher da Galeria', 'Tirar Foto'],
            cancelButtonIndex: 0,
          },
          (buttonIndex) => {
            if (buttonIndex === 1) {
              pickImageFromGallery();
            } else if (buttonIndex === 2) {
              takePhoto();
            }
          }
        );
      } else {
        Alert.alert(
          'Selecionar Foto',
          'Escolha uma opção:',
          [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Galeria', onPress: pickImageFromGallery },
            { text: 'Câmera', onPress: takePhoto },
          ]
        );
      }
    } catch (error) {
      console.error('Error selecting photo:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao selecionar a foto.');
    }
  };

  const pickImageFromGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
        // Aqui você pode salvar a imagem no backend
        console.log('Selected image:', result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao selecionar a imagem.');
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permissão necessária', 'Precisamos de permissão para usar sua câmera.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
        // Aqui você pode salvar a imagem no backend
        console.log('Captured image:', result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao capturar a foto.');
    }
  };

  const handleEditField = (field: string, currentValue: string) => {
    setEditingField(field);
    setEditingValue(currentValue);
    setShowEditModal(true);
  };

  const handleSaveField = () => {
    // Aqui você pode implementar a lógica para salvar no backend
    console.log(`Saving ${editingField}:`, editingValue);
    Alert.alert('Sucesso', 'Campo atualizado com sucesso!');
    setShowEditModal(false);
    setEditingField('');
    setEditingValue('');
  };

  const renderHeader = () => (
    <LinearGradient colors={['#3b82f6', '#8b5cf6']} style={styles.profileHeader}>
      <View style={styles.headerActions}>
        {!isOwnProfile && (
          <TouchableOpacity style={styles.headerButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
        )}
        <View style={styles.headerRightButtons}>
          {isOwnProfile && (
            <TouchableOpacity 
              style={[styles.headerButton, isEditMode && styles.headerButtonActive]} 
              onPress={() => setIsEditMode(!isEditMode)}
            >
              <Ionicons name={isEditMode ? "checkmark" : "create-outline"} size={24} color="white" />
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="share-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.profileInfo}>
        <TouchableOpacity 
          onPress={isOwnProfile && isEditMode ? handleEditPhoto : undefined} 
          style={styles.avatarContainer}
        >
          <Image source={selectedImage ? { uri: selectedImage } : getProfileImage()} style={styles.profileAvatar} />
          {isOwnProfile && isEditMode && (
            <View style={styles.editPhotoIcon}>
              <Ionicons name="camera" size={16} color="white" />
            </View>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={isOwnProfile && isEditMode ? () => handleEditField('name', user?.name || '') : undefined}
          style={isEditMode && isOwnProfile ? styles.editableField : undefined}
        >
          <Text style={styles.profileName}>{user?.name || 'Usuário'}</Text>
          {isOwnProfile && isEditMode && (
            <View style={styles.editIndicator}>
              <Ionicons name="create-outline" size={14} color="rgba(255, 255, 255, 0.8)" />
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={isOwnProfile && isEditMode ? () => handleEditField('occupation', user?.occupation || '') : undefined}
          style={isEditMode && isOwnProfile ? styles.editableField : undefined}
        >
          <Text style={styles.profileOccupation}>{user?.occupation || 'Desenvolvedor'}</Text>
          {isOwnProfile && isEditMode && (
            <View style={styles.editIndicator}>
              <Ionicons name="create-outline" size={12} color="rgba(255, 255, 255, 0.7)" />
            </View>
          )}
        </TouchableOpacity>
        
        {user?.company && (
          <TouchableOpacity 
            onPress={isOwnProfile && isEditMode ? () => handleEditField('company', user?.company || '') : undefined}
            style={isEditMode && isOwnProfile ? styles.editableField : undefined}
          >
            <Text style={styles.profileCompany}>@ {user.company}</Text>
            {isOwnProfile && isEditMode && (
              <View style={styles.editIndicator}>
                <Ionicons name="create-outline" size={12} color="rgba(255, 255, 255, 0.7)" />
              </View>
            )}
          </TouchableOpacity>
        )}
        <View style={styles.profileLocation}>
          <Ionicons name="location-outline" size={16} color="rgba(255, 255, 255, 0.8)" />
          <Text style={styles.profileLocationText}>
            {user?.location || 'Localização não informada'}
          </Text>
        </View>
        
        {/* Edit Mode Indicator */}
        {isOwnProfile && isEditMode && (
          <View style={styles.editModeIndicator}>
            <Ionicons name="create" size={16} color="white" />
            <Text style={styles.editModeText}>Modo de edição ativo</Text>
          </View>
        )}
        
        {/* Completion Percentage */}
        {isOwnProfile && !isEditMode && (
          <View style={styles.completionContainer}>
            <Text style={styles.completionText}>
              Perfil 75% completo
            </Text>
            <View style={styles.completionBar}>
              <View style={[styles.completionBarFill, { width: '75%' }]} />
            </View>
          </View>
        )}
      </View>
    </LinearGradient>
  );

  const renderSocialLinks = () => (
    <View style={styles.socialLinksContainer}>
      <Text style={styles.sectionTitle}>Redes Sociais</Text>
      <View style={styles.socialLinksGrid}>
        <TouchableOpacity style={styles.socialLinkItem}>
          <Ionicons name="logo-github" size={20} color="#3b82f6" />
          <Text style={styles.socialLinkText}>GitHub</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialLinkItem}>
          <Ionicons name="logo-linkedin" size={20} color="#3b82f6" />
          <Text style={styles.socialLinkText}>LinkedIn</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialLinkItem}>
          <Ionicons name="globe-outline" size={20} color="#3b82f6" />
          <Text style={styles.socialLinkText}>Portfolio</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderDescription = () => (
    <View style={styles.descriptionSection}>
      <Text style={styles.sectionTitle}>Sobre</Text>
      
      <TouchableOpacity 
        onPress={isOwnProfile && isEditMode ? () => handleEditField('bio', user?.bio || '') : undefined}
        style={[styles.descriptionContainer, isEditMode && isOwnProfile && styles.editableSection]}
      >
        <Text style={styles.descriptionText}>
          {user?.bio || 'Desenvolvedor apaixonado por tecnologia e inovação. Sempre buscando aprender novas tecnologias e contribuir para projetos que façam a diferença.'}
        </Text>
        {isOwnProfile && isEditMode && (
          <View style={styles.editSectionIndicator}>
            <Ionicons name="create-outline" size={16} color="#6b7280" />
            <Text style={styles.editHintText}>Toque para editar</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );

  const renderSkills = () => (
    <View style={styles.skillsSection}>
      <View style={styles.skillsHeader}>
        <Text style={styles.sectionTitle}>Competências</Text>
        {isOwnProfile && (
          <TouchableOpacity onPress={handleAddTechnology}>
            <Ionicons name="add-circle-outline" size={24} color="#3b82f6" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.skillsGrid}>
        <View style={styles.skillItem}>
          <View style={styles.skillContent}>
            <View style={[styles.skillIcon, { backgroundColor: '#61DAFB15' }]}>
              <Ionicons name="logo-react" size={18} color="#61DAFB" />
            </View>
            <View style={styles.skillTextContainer}>
              <Text style={styles.skillName}>React Native</Text>
              <Text style={[styles.skillLevel, { color: '#3b82f6' }]}>Avançado</Text>
            </View>
          </View>
        </View>

        <View style={styles.skillItem}>
          <View style={styles.skillContent}>
            <View style={[styles.skillIcon, { backgroundColor: '#F7DF1E15' }]}>
              <Ionicons name="logo-javascript" size={18} color="#F7DF1E" />
            </View>
            <View style={styles.skillTextContainer}>
              <Text style={styles.skillName}>JavaScript</Text>
              <Text style={[styles.skillLevel, { color: '#f59e0b' }]}>Expert</Text>
            </View>
          </View>
        </View>

        <View style={styles.skillItem}>
          <View style={styles.skillContent}>
            <View style={[styles.skillIcon, { backgroundColor: '#3178C615' }]}>
              <Ionicons name="code-slash-outline" size={18} color="#3178C6" />
            </View>
            <View style={styles.skillTextContainer}>
              <Text style={styles.skillName}>TypeScript</Text>
              <Text style={[styles.skillLevel, { color: '#3b82f6' }]}>Avançado</Text>
            </View>
          </View>
        </View>
      </View>

      {showTechnologySelector && (
        <View style={styles.comingSoonContainer}>
          <Ionicons name="construct-outline" size={48} color="#9ca3af" />
          <Text style={styles.comingSoonText}>Seletor de Tecnologias</Text>
          <Text style={styles.comingSoonSubtext}>Em breve você poderá adicionar suas tecnologias favoritas!</Text>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => setShowTechnologySelector(false)}
          >
            <Text style={styles.closeButtonText}>Fechar</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const renderExperiences = () => (
    <View style={styles.experiencesSection}>
      <Text style={styles.sectionTitle}>Experiência</Text>
      <View style={styles.experienceItem}>
        <View style={styles.experienceHeader}>
          <View style={styles.experienceIcon}>
            <Ionicons name="briefcase-outline" size={20} color="#3b82f6" />
          </View>
          <View style={styles.experienceContent}>
            <Text style={styles.experiencePosition}>Desenvolvedor Mobile</Text>
            <Text style={styles.experienceCompany}>Tech Company</Text>
            <View style={styles.experienceDetails}>
              <Text style={styles.experienceDate}>Jan 2023 - Presente</Text>
              <Text style={styles.experienceLocation}>• São Paulo, SP</Text>
            </View>
            <Text style={styles.experienceDescription}>
              Desenvolvimento de aplicativos móveis usando React Native, integração com APIs REST e GraphQL.
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderProjects = () => (
    <View style={styles.projectsSection}>
      <Text style={styles.sectionTitle}>Projetos</Text>
      <View style={styles.projectItem}>
        <View style={styles.projectHeader}>
          <Text style={styles.projectName}>SocialDev Mobile</Text>
          <View style={styles.projectLinks}>
            <TouchableOpacity>
              <Ionicons name="logo-github" size={20} color="#3b82f6" />
            </TouchableOpacity>
            <TouchableOpacity>
              <Ionicons name="open-outline" size={20} color="#3b82f6" />
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.projectDescription}>
          Aplicativo de rede social para desenvolvedores com funcionalidades de chat, feed e busca de vagas.
        </Text>
        <View style={styles.projectTechnologies}>
          <View style={styles.projectTechTag}>
            <Text style={styles.projectTechText}>React Native</Text>
          </View>
          <View style={styles.projectTechTag}>
            <Text style={styles.projectTechText}>TypeScript</Text>
          </View>
          <View style={styles.projectTechTag}>
            <Text style={styles.projectTechText}>Supabase</Text>
          </View>
        </View>
        <Text style={styles.projectDate}>Set 2024 - Presente</Text>
      </View>
    </View>
  );

  const renderSavedResumes = () => {
    if (!isOwnProfile || (!loadingResumes && savedResumes.length === 0)) {
      return null;
    }

    return (
      <View style={styles.resumesSection}>
        <View style={styles.resumesHeader}>
          <Text style={styles.sectionTitle}>Meus Currículos</Text>
          <TouchableOpacity onPress={() => navigation.navigate('MyResumes')}>
            <Text style={styles.viewAllText}>Ver todos</Text>
          </TouchableOpacity>
        </View>

        {loadingResumes ? (
          <View style={styles.resumesLoading}>
            <ActivityIndicator size="small" color="#3b82f6" />
            <Text style={styles.loadingText}>Carregando currículos...</Text>
          </View>
        ) : (
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.resumesScrollContainer}
          >
            {savedResumes.slice(0, 3).map((resume, index) => (
              <TouchableOpacity 
                key={resume.id} 
                style={styles.resumeCard}
                onPress={() => navigation.navigate('MyResumes')}
              >
                <LinearGradient 
                  colors={getResumeGradient(index)} 
                  style={styles.resumeCardGradient}
                >
                  <View style={styles.resumeCardContent}>
                    <Ionicons name="document-text" size={24} color="white" />
                    <Text style={styles.resumeCardTitle} numberOfLines={2}>
                      {resume.title}
                    </Text>
                    <Text style={styles.resumeCardDate}>
                      {new Date(resume.updated_at).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: '2-digit'
                      })}
                    </Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            ))}
            
            <TouchableOpacity 
              style={styles.addResumeCard}
              onPress={() => navigation.navigate('ResumeBuilder')}
            >
              <View style={styles.addResumeContent}>
                <Ionicons name="add-circle-outline" size={32} color="#3b82f6" />
                <Text style={styles.addResumeText}>Criar Novo</Text>
              </View>
            </TouchableOpacity>
          </ScrollView>
        )}
      </View>
    );
  };

  const getResumeGradient = (index: number): string[] => {
    const gradients = [
      ['#667eea', '#764ba2'],
      ['#f093fb', '#f5576c'],
      ['#4facfe', '#00f2fe'],
      ['#43e97b', '#38f9d7'],
      ['#fa709a', '#fee140'],
    ];
    return gradients[index % gradients.length];
  };

  const renderEditModal = () => (
    <Modal
      visible={showEditModal}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowEditModal(false)}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setShowEditModal(false)}>
            <Text style={styles.modalCancel}>Cancelar</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Editar {editingField === 'bio' ? 'Sobre' : editingField === 'name' ? 'Nome' : editingField === 'occupation' ? 'Ocupação' : 'Empresa'}</Text>
          <TouchableOpacity onPress={handleSaveField}>
            <Text style={styles.modalSave}>Salvar</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.modalContent}>
          <TextInput
            style={[
              styles.modalInput,
              editingField === 'bio' && styles.modalInputMultiline
            ]}
            value={editingValue}
            onChangeText={setEditingValue}
            placeholder={`Digite seu ${editingField === 'bio' ? 'sobre' : editingField === 'name' ? 'nome' : editingField === 'occupation' ? 'cargo' : 'empresa'}`}
            multiline={editingField === 'bio'}
            numberOfLines={editingField === 'bio' ? 6 : 1}
            autoFocus
          />
        </View>
      </SafeAreaView>
    </Modal>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text style={styles.loadingText}>Carregando perfil...</Text>
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
        {renderSavedResumes()}
      </ScrollView>
      {renderEditModal()}
    </SafeAreaView>
  );
}

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
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
  },
  profileHeader: {
    paddingTop: 20,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerRightButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerButtonActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    transform: [{ scale: 1.05 }],
  },
  profileInfo: {
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
  },
  editPhotoIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  editableField: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginVertical: 2,
  },
  editIndicator: {
    marginLeft: 8,
    opacity: 0.8,
  },
  descriptionContainer: {
    paddingVertical: 4,
  },
  editableSection: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderStyle: 'dashed',
  },
  editSectionIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    gap: 6,
  },
  editHintText: {
    fontSize: 12,
    color: '#6b7280',
    fontStyle: 'italic',
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
  editModeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
    marginTop: 8,
  },
  editModeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
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
  resumesSection: {
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
  resumesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllText: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '600',
  },
  resumesLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    gap: 8,
  },
  resumesScrollContainer: {
    paddingRight: 16,
  },
  resumeCard: {
    width: 140,
    height: 160,
    marginRight: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  resumeCardGradient: {
    flex: 1,
    padding: 16,
  },
  resumeCardContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  resumeCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
    marginTop: 8,
    lineHeight: 18,
  },
  resumeCardDate: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 'auto',
  },
  addResumeCard: {
    width: 140,
    height: 160,
    borderRadius: 12,
    backgroundColor: '#f8fafc',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderStyle: 'dashed',
  },
  addResumeContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  addResumeText: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '600',
  },
  comingSoonContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    marginTop: 16,
  },
  comingSoonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 12,
  },
  comingSoonSubtext: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  closeButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#3b82f6',
    borderRadius: 8,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  modalCancel: {
    fontSize: 16,
    color: '#6b7280',
  },
  modalSave: {
    fontSize: 16,
    color: '#3b82f6',
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  modalInput: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1f2937',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  modalInputMultiline: {
    height: 120,
    textAlignVertical: 'top',
  },
});