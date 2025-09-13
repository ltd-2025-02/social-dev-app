import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
  Modal,
  KeyboardAvoidingView,
  Platform,
  ActionSheetIOS,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { useTheme } from '../../contexts/ThemeContext';
import { useThemedStyles } from '../../hooks/useThemedStyles';
import PersonaSelector from '../../components/PersonaSelector';
import { PERSONAS, getPersonaById, getPersonaImage } from '../../utils/personas';
import * as ImagePicker from 'expo-image-picker';

interface EditProfileScreenProps {
  navigation: any;
}

interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

interface Experience {
  id: string;
  position: string;
  company: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  location: string;
}

interface Education {
  id: string;
  degree: string;
  institution: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  field: string;
  gpa?: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  startDate: string;
  endDate?: string;
  url?: string;
  repository?: string;
}

interface Skill {
  name: string;
  level: 'Iniciante' | 'Intermediário' | 'Avançado' | 'Expert';
  category: string;
}

interface Language {
  language: string;
  proficiency: 'Básico' | 'Intermediário' | 'Avançado' | 'Nativo';
}

interface Certificate {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  url?: string;
}

interface Course {
  id: string;
  name: string;
  provider: string;
  completionDate: string;
  duration: string;
  certificate?: string;
}

export default function EditProfileScreen({ navigation }: EditProfileScreenProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { colors } = useTheme();
  const themedStyles = useThemedStyles();
  
  // Estado do perfil
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    occupation: user?.occupation || '',
    company: user?.company || '',
    location: user?.location || '',
    bio: user?.bio || '',
    website: user?.website || '',
    persona_id: user?.persona_id || null,
    avatar: user?.avatar || null,
  });

  // Estados das seções
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);

  // Estados da UI
  const [saving, setSaving] = useState(false);
  const [showPersonaSelector, setShowPersonaSelector] = useState(false);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      backgroundColor: colors.surface,
      paddingVertical: 16,
      paddingHorizontal: 20,
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
      flex: 1,
      textAlign: 'center',
    },
    headerButton: {
      padding: 8,
    },
    headerButtonText: {
      fontSize: 16,
      fontWeight: '600',
    },
    cancelText: {
      color: colors.textMuted,
    },
    saveText: {
      color: colors.primary,
    },
    content: {
      flex: 1,
    },
    section: {
      backgroundColor: colors.surface,
      marginHorizontal: 16,
      marginVertical: 8,
      borderRadius: 12,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.text,
    },
    addButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.primary + '20',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
    },
    addButtonText: {
      fontSize: 12,
      color: colors.primary,
      fontWeight: '600',
      marginLeft: 4,
    },
    profileSection: {
      alignItems: 'center',
      paddingVertical: 20,
    },
    avatarContainer: {
      position: 'relative',
      marginBottom: 16,
    },
    avatar: {
      width: 100,
      height: 100,
      borderRadius: 50,
      borderWidth: 3,
      borderColor: colors.primary,
    },
    avatarEditButton: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      backgroundColor: colors.primary,
      borderRadius: 16,
      width: 32,
      height: 32,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: colors.surface,
    },
    personaButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.background,
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.border,
      marginTop: 12,
    },
    personaButtonText: {
      fontSize: 14,
      color: colors.primary,
      fontWeight: '600',
      marginLeft: 8,
    },
    inputGroup: {
      marginBottom: 16,
    },
    inputLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 6,
    },
    input: {
      backgroundColor: colors.inputBackground,
      borderColor: colors.inputBorder,
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 10,
      fontSize: 16,
      color: colors.inputText,
    },
    textArea: {
      height: 80,
      textAlignVertical: 'top',
    },
    itemCard: {
      backgroundColor: colors.background,
      borderRadius: 8,
      padding: 12,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    itemHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 8,
    },
    itemTitle: {
      fontSize: 14,
      fontWeight: 'bold',
      color: colors.text,
      flex: 1,
    },
    itemSubtitle: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 2,
    },
    itemActions: {
      flexDirection: 'row',
      gap: 8,
    },
    actionButton: {
      padding: 4,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 20,
      width: '90%',
      maxHeight: '80%',
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
    },
    modalCloseButton: {
      padding: 8,
    },
    modalButtons: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 20,
    },
    modalButton: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: 'center',
    },
    modalCancelButton: {
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
    },
    modalSaveButton: {
      backgroundColor: colors.primary,
    },
    modalButtonText: {
      fontSize: 16,
      fontWeight: '600',
    },
    modalCancelText: {
      color: colors.textMuted,
    },
    modalSaveText: {
      color: colors.primaryText,
    },
    skillTag: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.primary + '20',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      marginRight: 8,
      marginBottom: 8,
    },
    skillTagText: {
      fontSize: 12,
      color: colors.primary,
      fontWeight: '600',
    },
    skillsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    emptyState: {
      alignItems: 'center',
      paddingVertical: 20,
    },
    emptyStateText: {
      fontSize: 14,
      color: colors.textMuted,
      textAlign: 'center',
    },
  });

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    // Carregar dados do perfil do usuário
    try {
      // Aqui você carregaria os dados do banco de dados
      // Por enquanto, vamos usar dados mock
    } catch (error) {
      console.error('Error loading profile data:', error);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Validação básica
      if (!profileData.name.trim()) {
        Alert.alert('Erro', 'Nome é obrigatório');
        return;
      }

      // Salvar dados do perfil
      const profileToSave = {
        ...profileData,
        socialLinks,
        experiences,
        education,
        projects,
        skills,
        languages,
        certificates,
        courses,
      };

      console.log('Saving profile:', profileToSave);
      
      // Aqui você salvaria no banco de dados
      // await profileService.updateProfile(user.id, profileToSave);
      
      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
      
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Erro', 'Não foi possível salvar o perfil');
    } finally {
      setSaving(false);
    }
  };

  const handleImagePicker = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permissão necessária', 'Precisamos de permissão para acessar sua galeria.');
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
        setProfileData(prev => ({ ...prev, avatar: result.assets[0].uri }));
      }
    } catch (error) {
      console.error('Error picking image:', error);
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
        setProfileData(prev => ({ ...prev, avatar: result.assets[0].uri }));
      }
    } catch (error) {
      console.error('Error taking photo:', error);
    }
  };

  const handlePersonaSelect = (persona: any) => {
    setProfileData(prev => ({ ...prev, persona_id: persona.id }));
  };

  const openEditModal = (section: string, item?: any) => {
    setEditingSection(section);
    setEditingItem(item || {});
    setShowModal(true);
  };

  const closeEditModal = () => {
    setEditingSection(null);
    setEditingItem(null);
    setShowModal(false);
  };

  const handleSaveItem = () => {
    if (!editingSection) return;

    switch (editingSection) {
      case 'socialLinks':
        if (editingItem.id) {
          setSocialLinks(prev => prev.map(item => 
            item.platform === editingItem.platform ? editingItem : item
          ));
        } else {
          setSocialLinks(prev => [...prev, { ...editingItem, id: Date.now().toString() }]);
        }
        break;
      case 'experiences':
        if (editingItem.id) {
          setExperiences(prev => prev.map(item => 
            item.id === editingItem.id ? editingItem : item
          ));
        } else {
          setExperiences(prev => [...prev, { ...editingItem, id: Date.now().toString() }]);
        }
        break;
      case 'education':
        if (editingItem.id) {
          setEducation(prev => prev.map(item => 
            item.id === editingItem.id ? editingItem : item
          ));
        } else {
          setEducation(prev => [...prev, { ...editingItem, id: Date.now().toString() }]);
        }
        break;
      case 'projects':
        if (editingItem.id) {
          setProjects(prev => prev.map(item => 
            item.id === editingItem.id ? editingItem : item
          ));
        } else {
          setProjects(prev => [...prev, { ...editingItem, id: Date.now().toString() }]);
        }
        break;
      case 'skills':
        if (!editingItem.name) return;
        const skillExists = skills.find(s => s.name === editingItem.name);
        if (!skillExists) {
          setSkills(prev => [...prev, editingItem]);
        }
        break;
      case 'languages':
        if (!editingItem.language) return;
        const langExists = languages.find(l => l.language === editingItem.language);
        if (!langExists) {
          setLanguages(prev => [...prev, editingItem]);
        }
        break;
      case 'certificates':
        if (editingItem.id) {
          setCertificates(prev => prev.map(item => 
            item.id === editingItem.id ? editingItem : item
          ));
        } else {
          setCertificates(prev => [...prev, { ...editingItem, id: Date.now().toString() }]);
        }
        break;
      case 'courses':
        if (editingItem.id) {
          setCourses(prev => prev.map(item => 
            item.id === editingItem.id ? editingItem : item
          ));
        } else {
          setCourses(prev => [...prev, { ...editingItem, id: Date.now().toString() }]);
        }
        break;
    }
    closeEditModal();
  };

  const deleteItem = (section: string, id: string) => {
    Alert.alert(
      'Confirmar exclusão',
      'Tem certeza que deseja excluir este item?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive',
          onPress: () => {
            switch (section) {
              case 'socialLinks':
                setSocialLinks(prev => prev.filter(item => item.platform !== id));
                break;
              case 'experiences':
                setExperiences(prev => prev.filter(item => item.id !== id));
                break;
              case 'education':
                setEducation(prev => prev.filter(item => item.id !== id));
                break;
              case 'projects':
                setProjects(prev => prev.filter(item => item.id !== id));
                break;
              case 'skills':
                setSkills(prev => prev.filter(item => item.name !== id));
                break;
              case 'languages':
                setLanguages(prev => prev.filter(item => item.language !== id));
                break;
              case 'certificates':
                setCertificates(prev => prev.filter(item => item.id !== id));
                break;
              case 'courses':
                setCourses(prev => prev.filter(item => item.id !== id));
                break;
            }
          }
        }
      ]
    );
  };

  const getProfileImage = () => {
    if (profileData.avatar) {
      return { uri: profileData.avatar };
    }
    if (profileData.persona_id) {
      const persona = getPersonaById(profileData.persona_id);
      if (persona) {
        return persona.path;
      }
    }
    return { uri: `https://ui-avatars.com/api/?name=${encodeURIComponent(profileData.name || 'User')}&background=2563eb&color=fff` };
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.headerButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={[styles.headerButtonText, styles.cancelText]}>Cancelar</Text>
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Editar Perfil</Text>
        
        <TouchableOpacity 
          style={styles.headerButton}
          onPress={handleSave}
          disabled={saving}
        >
          <Text style={[styles.headerButtonText, styles.saveText]}>
            {saving ? 'Salvando...' : 'Salvar'}
          </Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Foto e Informações Básicas */}
          <View style={styles.section}>
            <View style={styles.profileSection}>
              <View style={styles.avatarContainer}>
                <Image source={getProfileImage()} style={styles.avatar} />
                <TouchableOpacity 
                  style={styles.avatarEditButton}
                  onPress={handleImagePicker}
                >
                  <Ionicons name="camera" size={16} color={colors.primaryText} />
                </TouchableOpacity>
              </View>
              
              <TouchableOpacity 
                style={styles.personaButton}
                onPress={() => setShowPersonaSelector(true)}
              >
                <Ionicons name="happy-outline" size={16} color={colors.primary} />
                <Text style={styles.personaButtonText}>
                  {profileData.persona_id ? 'Alterar Persona' : 'Escolher Persona'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nome *</Text>
              <TextInput
                style={styles.input}
                value={profileData.name}
                onChangeText={(text) => setProfileData(prev => ({ ...prev, name: text }))}
                placeholder="Seu nome completo"
                placeholderTextColor={colors.textMuted}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.input}
                value={profileData.email}
                onChangeText={(text) => setProfileData(prev => ({ ...prev, email: text }))}
                placeholder="seu.email@exemplo.com"
                placeholderTextColor={colors.textMuted}
                keyboardType="email-address"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Telefone</Text>
              <TextInput
                style={styles.input}
                value={profileData.phone}
                onChangeText={(text) => setProfileData(prev => ({ ...prev, phone: text }))}
                placeholder="(11) 99999-9999"
                placeholderTextColor={colors.textMuted}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Ocupação</Text>
              <TextInput
                style={styles.input}
                value={profileData.occupation}
                onChangeText={(text) => setProfileData(prev => ({ ...prev, occupation: text }))}
                placeholder="Desenvolvedor Mobile"
                placeholderTextColor={colors.textMuted}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Empresa</Text>
              <TextInput
                style={styles.input}
                value={profileData.company}
                onChangeText={(text) => setProfileData(prev => ({ ...prev, company: text }))}
                placeholder="Nome da empresa"
                placeholderTextColor={colors.textMuted}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Localização</Text>
              <TextInput
                style={styles.input}
                value={profileData.location}
                onChangeText={(text) => setProfileData(prev => ({ ...prev, location: text }))}
                placeholder="São Paulo, SP"
                placeholderTextColor={colors.textMuted}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Website</Text>
              <TextInput
                style={styles.input}
                value={profileData.website}
                onChangeText={(text) => setProfileData(prev => ({ ...prev, website: text }))}
                placeholder="https://seusite.com"
                placeholderTextColor={colors.textMuted}
                keyboardType="url"
              />
            </View>
          </View>

          {/* Sobre */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Sobre</Text>
            </View>
            <View style={styles.inputGroup}>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={profileData.bio}
                onChangeText={(text) => setProfileData(prev => ({ ...prev, bio: text }))}
                placeholder="Conte um pouco sobre você, suas paixões e objetivos profissionais..."
                placeholderTextColor={colors.textMuted}
                multiline
                numberOfLines={4}
              />
            </View>
          </View>

          {/* Redes Sociais */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Redes Sociais</Text>
              <TouchableOpacity 
                style={styles.addButton}
                onPress={() => openEditModal('socialLinks')}
              >
                <Ionicons name="add" size={16} color={colors.primary} />
                <Text style={styles.addButtonText}>Adicionar</Text>
              </TouchableOpacity>
            </View>
            
            {socialLinks.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>
                  Nenhuma rede social adicionada
                </Text>
              </View>
            ) : (
              socialLinks.map((link, index) => (
                <View key={index} style={styles.itemCard}>
                  <View style={styles.itemHeader}>
                    <View>
                      <Text style={styles.itemTitle}>{link.platform}</Text>
                      <Text style={styles.itemSubtitle}>{link.url}</Text>
                    </View>
                    <View style={styles.itemActions}>
                      <TouchableOpacity 
                        style={styles.actionButton}
                        onPress={() => openEditModal('socialLinks', link)}
                      >
                        <Ionicons name="create-outline" size={18} color={colors.primary} />
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.actionButton}
                        onPress={() => deleteItem('socialLinks', link.platform)}
                      >
                        <Ionicons name="trash-outline" size={18} color={colors.error} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))
            )}
          </View>

          {/* Competências */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Competências</Text>
              <TouchableOpacity 
                style={styles.addButton}
                onPress={() => openEditModal('skills')}
              >
                <Ionicons name="add" size={16} color={colors.primary} />
                <Text style={styles.addButtonText}>Adicionar</Text>
              </TouchableOpacity>
            </View>
            
            {skills.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>
                  Nenhuma competência adicionada
                </Text>
              </View>
            ) : (
              <View style={styles.skillsContainer}>
                {skills.map((skill, index) => (
                  <TouchableOpacity 
                    key={index} 
                    style={styles.skillTag}
                    onLongPress={() => deleteItem('skills', skill.name)}
                  >
                    <Text style={styles.skillTagText}>
                      {skill.name} - {skill.level}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Experiência Profissional */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Experiência Profissional</Text>
              <TouchableOpacity 
                style={styles.addButton}
                onPress={() => openEditModal('experiences')}
              >
                <Ionicons name="add" size={16} color={colors.primary} />
                <Text style={styles.addButtonText}>Adicionar</Text>
              </TouchableOpacity>
            </View>
            
            {experiences.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>
                  Nenhuma experiência adicionada
                </Text>
              </View>
            ) : (
              experiences.map((exp) => (
                <View key={exp.id} style={styles.itemCard}>
                  <View style={styles.itemHeader}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.itemTitle}>{exp.position}</Text>
                      <Text style={styles.itemSubtitle}>{exp.company}</Text>
                      <Text style={styles.itemSubtitle}>
                        {exp.startDate} - {exp.current ? 'Presente' : exp.endDate}
                      </Text>
                    </View>
                    <View style={styles.itemActions}>
                      <TouchableOpacity 
                        style={styles.actionButton}
                        onPress={() => openEditModal('experiences', exp)}
                      >
                        <Ionicons name="create-outline" size={18} color={colors.primary} />
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.actionButton}
                        onPress={() => deleteItem('experiences', exp.id)}
                      >
                        <Ionicons name="trash-outline" size={18} color={colors.error} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))
            )}
          </View>

          {/* Formação Acadêmica */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Formação Acadêmica</Text>
              <TouchableOpacity 
                style={styles.addButton}
                onPress={() => openEditModal('education')}
              >
                <Ionicons name="add" size={16} color={colors.primary} />
                <Text style={styles.addButtonText}>Adicionar</Text>
              </TouchableOpacity>
            </View>
            
            {education.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>
                  Nenhuma formação adicionada
                </Text>
              </View>
            ) : (
              education.map((edu) => (
                <View key={edu.id} style={styles.itemCard}>
                  <View style={styles.itemHeader}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.itemTitle}>{edu.degree}</Text>
                      <Text style={styles.itemSubtitle}>{edu.institution}</Text>
                      <Text style={styles.itemSubtitle}>
                        {edu.startDate} - {edu.current ? 'Em andamento' : edu.endDate}
                      </Text>
                    </View>
                    <View style={styles.itemActions}>
                      <TouchableOpacity 
                        style={styles.actionButton}
                        onPress={() => openEditModal('education', edu)}
                      >
                        <Ionicons name="create-outline" size={18} color={colors.primary} />
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.actionButton}
                        onPress={() => deleteItem('education', edu.id)}
                      >
                        <Ionicons name="trash-outline" size={18} color={colors.error} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))
            )}
          </View>

          {/* Projetos */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Projetos</Text>
              <TouchableOpacity 
                style={styles.addButton}
                onPress={() => openEditModal('projects')}
              >
                <Ionicons name="add" size={16} color={colors.primary} />
                <Text style={styles.addButtonText}>Adicionar</Text>
              </TouchableOpacity>
            </View>
            
            {projects.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>
                  Nenhum projeto adicionado
                </Text>
              </View>
            ) : (
              projects.map((project) => (
                <View key={project.id} style={styles.itemCard}>
                  <View style={styles.itemHeader}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.itemTitle}>{project.name}</Text>
                      <Text style={styles.itemSubtitle}>{project.description}</Text>
                      <Text style={styles.itemSubtitle}>
                        {project.technologies.join(', ')}
                      </Text>
                    </View>
                    <View style={styles.itemActions}>
                      <TouchableOpacity 
                        style={styles.actionButton}
                        onPress={() => openEditModal('projects', project)}
                      >
                        <Ionicons name="create-outline" size={18} color={colors.primary} />
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.actionButton}
                        onPress={() => deleteItem('projects', project.id)}
                      >
                        <Ionicons name="trash-outline" size={18} color={colors.error} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))
            )}
          </View>

          {/* Idiomas */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Idiomas</Text>
              <TouchableOpacity 
                style={styles.addButton}
                onPress={() => openEditModal('languages')}
              >
                <Ionicons name="add" size={16} color={colors.primary} />
                <Text style={styles.addButtonText}>Adicionar</Text>
              </TouchableOpacity>
            </View>
            
            {languages.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>
                  Nenhum idioma adicionado
                </Text>
              </View>
            ) : (
              <View style={styles.skillsContainer}>
                {languages.map((lang, index) => (
                  <TouchableOpacity 
                    key={index} 
                    style={styles.skillTag}
                    onLongPress={() => deleteItem('languages', lang.language)}
                  >
                    <Text style={styles.skillTagText}>
                      {lang.language} - {lang.proficiency}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Certificações */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Certificações</Text>
              <TouchableOpacity 
                style={styles.addButton}
                onPress={() => openEditModal('certificates')}
              >
                <Ionicons name="add" size={16} color={colors.primary} />
                <Text style={styles.addButtonText}>Adicionar</Text>
              </TouchableOpacity>
            </View>
            
            {certificates.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>
                  Nenhuma certificação adicionada
                </Text>
              </View>
            ) : (
              certificates.map((cert) => (
                <View key={cert.id} style={styles.itemCard}>
                  <View style={styles.itemHeader}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.itemTitle}>{cert.name}</Text>
                      <Text style={styles.itemSubtitle}>{cert.issuer}</Text>
                      <Text style={styles.itemSubtitle}>
                        Emitido em: {cert.issueDate}
                      </Text>
                    </View>
                    <View style={styles.itemActions}>
                      <TouchableOpacity 
                        style={styles.actionButton}
                        onPress={() => openEditModal('certificates', cert)}
                      >
                        <Ionicons name="create-outline" size={18} color={colors.primary} />
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.actionButton}
                        onPress={() => deleteItem('certificates', cert.id)}
                      >
                        <Ionicons name="trash-outline" size={18} color={colors.error} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))
            )}
          </View>

          {/* Cursos */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Cursos</Text>
              <TouchableOpacity 
                style={styles.addButton}
                onPress={() => openEditModal('courses')}
              >
                <Ionicons name="add" size={16} color={colors.primary} />
                <Text style={styles.addButtonText}>Adicionar</Text>
              </TouchableOpacity>
            </View>
            
            {courses.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>
                  Nenhum curso adicionado
                </Text>
              </View>
            ) : (
              courses.map((course) => (
                <View key={course.id} style={styles.itemCard}>
                  <View style={styles.itemHeader}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.itemTitle}>{course.name}</Text>
                      <Text style={styles.itemSubtitle}>{course.provider}</Text>
                      <Text style={styles.itemSubtitle}>
                        Concluído em: {course.completionDate} • {course.duration}
                      </Text>
                    </View>
                    <View style={styles.itemActions}>
                      <TouchableOpacity 
                        style={styles.actionButton}
                        onPress={() => openEditModal('courses', course)}
                      >
                        <Ionicons name="create-outline" size={18} color={colors.primary} />
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.actionButton}
                        onPress={() => deleteItem('courses', course.id)}
                      >
                        <Ionicons name="trash-outline" size={18} color={colors.error} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))
            )}
          </View>

          <View style={{ height: 50 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Persona Selector */}
      <PersonaSelector
        visible={showPersonaSelector}
        onClose={() => setShowPersonaSelector(false)}
        onSelectPersona={handlePersonaSelect}
        currentPersonaId={profileData.persona_id}
      />

      {/* Edit Modal - Simplified for now */}
      {showModal && (
        <Modal visible={showModal} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {editingSection === 'socialLinks' && 'Rede Social'}
                  {editingSection === 'skills' && 'Competência'}
                  {editingSection === 'languages' && 'Idioma'}
                  {editingSection === 'experiences' && 'Experiência'}
                  {editingSection === 'education' && 'Formação'}
                  {editingSection === 'projects' && 'Projeto'}
                  {editingSection === 'certificates' && 'Certificação'}
                  {editingSection === 'courses' && 'Curso'}
                </Text>
                <TouchableOpacity onPress={closeEditModal}>
                  <Ionicons name="close" size={24} color={colors.text} />
                </TouchableOpacity>
              </View>

              <ScrollView>
                {/* Formulário básico - seria expandido para cada tipo */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Nome</Text>
                  <TextInput
                    style={styles.input}
                    value={editingItem.name || editingItem.platform || editingItem.position || editingItem.degree || editingItem.language || ''}
                    onChangeText={(text) => {
                      const field = editingSection === 'socialLinks' ? 'platform' :
                                   editingSection === 'experiences' ? 'position' :
                                   editingSection === 'education' ? 'degree' :
                                   editingSection === 'languages' ? 'language' : 'name';
                      setEditingItem(prev => ({ ...prev, [field]: text }));
                    }}
                    placeholder="Digite o nome..."
                    placeholderTextColor={colors.textMuted}
                  />
                </View>

                {editingSection === 'skills' && (
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Nível</Text>
                    <TextInput
                      style={styles.input}
                      value={editingItem.level || 'Intermediário'}
                      onChangeText={(text) => setEditingItem(prev => ({ ...prev, level: text }))}
                      placeholder="Nível de competência"
                      placeholderTextColor={colors.textMuted}
                    />
                  </View>
                )}
              </ScrollView>

              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.modalCancelButton]}
                  onPress={closeEditModal}
                >
                  <Text style={[styles.modalButtonText, styles.modalCancelText]}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.modalSaveButton]}
                  onPress={handleSaveItem}
                >
                  <Text style={[styles.modalButtonText, styles.modalSaveText]}>Salvar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}