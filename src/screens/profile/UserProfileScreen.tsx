import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  ImageBackground,
} from 'react-native';
import { Image } from 'expo-image';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { usersService, UserSearchResult } from '../../services/users.service';
import { UserProfile, profileService } from '../../services/profile.service';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const { width } = Dimensions.get('window');

export default function UserProfileScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { userId } = route.params as { userId: string };
  const currentUser = useSelector((state: RootState) => state.auth.user);

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    loadProfile();
    checkConnectionStatus();
  }, [userId]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const userProfile = await usersService.getUserProfile(userId);
      setProfile(userProfile);
      
      // Registrar visualização do perfil
      if (currentUser?.id && currentUser.id !== userId) {
        await profileService.recordProfileView(userId, currentUser.id);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      Alert.alert('Erro', 'Não foi possível carregar o perfil do usuário');
    } finally {
      setLoading(false);
    }
  };

  const checkConnectionStatus = async () => {
    // Verificar se já existe conexão (implementar quando necessário)
    setIsConnected(false);
  };

  const handleConnect = async () => {
    try {
      Alert.alert(
        'Conectar',
        `Deseja se conectar com ${profile?.name}?`,
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Conectar',
            onPress: async () => {
              // Implementar lógica de conexão
              Alert.alert('Sucesso', 'Solicitação de conexão enviada!');
              setIsConnected(true);
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error connecting:', error);
      Alert.alert('Erro', 'Não foi possível enviar a solicitação de conexão');
    }
  };

  const handleMessage = () => {
    // Navegar para chat com o usuário
    Alert.alert('Info', 'Funcionalidade de mensagem será implementada em breve');
  };

  const renderSkills = () => {
    if (!profile?.skills || profile.skills.length === 0) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Habilidades</Text>
        <View style={styles.skillsContainer}>
          {profile.skills.map((skill) => (
            <View key={skill.id} style={styles.skillChip}>
              <Text style={styles.skillText}>{skill.name}</Text>
              <Text style={styles.skillLevel}>{skill.level}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderStats = () => (
    <View style={styles.statsContainer}>
      <View style={styles.statItem}>
        <Text style={styles.statNumber}>0</Text>
        <Text style={styles.statLabel}>Conexões</Text>
      </View>
      <View style={styles.statItem}>
        <Text style={styles.statNumber}>0</Text>
        <Text style={styles.statLabel}>Posts</Text>
      </View>
      <View style={styles.statItem}>
        <Text style={styles.statNumber}>{profile?.skills?.length || 0}</Text>
        <Text style={styles.statLabel}>Skills</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Carregando perfil...</Text>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Perfil não encontrado</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header com Avatar e Info Básica */}
      <View style={styles.header}>
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
            <View style={styles.avatarContainer}>
              <Image
                source={
                  profile.avatar
                    ? { uri: profile.avatar }
                    : require('../../../assets/images/default-avatar.png')
                }
                style={styles.avatar}
              />
              {profile.profile_visibility === 'public' && (
                <View style={styles.verifiedBadge}>
                  <Ionicons name="checkmark" size={12} color="white" />
                </View>
              )}
            </View>
            <Text style={styles.name}>{profile.name || 'Nome não informado'}</Text>
            <Text style={styles.headline}>
              {profile.headline || profile.occupation || 'Sem ocupação informada'}
            </Text>
            {profile.company && (
              <Text style={styles.company}>📍 {profile.company}</Text>
            )}
            {profile.location && (
              <Text style={styles.location}>📍 {profile.location}</Text>
            )}
          </View>
        </LinearGradient>
      </View>

      {/* Botões de Ação */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, styles.primaryButton]}
          onPress={handleConnect}
          disabled={isConnected}
        >
          <Ionicons 
            name={isConnected ? "checkmark" : "person-add"} 
            size={16} 
            color="white" 
          />
          <Text style={styles.primaryButtonText}>
            {isConnected ? 'Conectado' : 'Conectar'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, styles.secondaryButton]}
          onPress={handleMessage}
        >
          <Ionicons name="chatbubble" size={16} color="#667eea" />
          <Text style={styles.secondaryButtonText}>Mensagem</Text>
        </TouchableOpacity>
      </View>

      {/* Estatísticas */}
      {renderStats()}

      {/* Sobre */}
      {profile.bio && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sobre</Text>
          <Text style={styles.bioText}>{profile.bio}</Text>
        </View>
      )}

      {/* Habilidades */}
      {renderSkills()}

      {/* Informações de Contato */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informações de Contato</Text>
        
        {profile.email && (
          <View style={styles.contactItem}>
            <Ionicons name="mail" size={16} color="#666" />
            <Text style={styles.contactText}>{profile.email}</Text>
          </View>
        )}
        
        {profile.phone && (
          <View style={styles.contactItem}>
            <Ionicons name="call" size={16} color="#666" />
            <Text style={styles.contactText}>{profile.phone}</Text>
          </View>
        )}
        
        {profile.website && (
          <View style={styles.contactItem}>
            <Ionicons name="globe" size={16} color="#666" />
            <Text style={styles.contactText}>{profile.website}</Text>
          </View>
        )}
      </View>

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: 'white',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  headerGradient: {
    padding: 20,
    paddingTop: 40,
  },
  headerContent: {
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: 'white',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 4,
  },
  headline: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 4,
  },
  company: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 2,
  },
  location: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  primaryButton: {
    backgroundColor: '#667eea',
  },
  secondaryButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#667eea',
  },
  primaryButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  secondaryButtonText: {
    color: '#667eea',
    fontWeight: '600',
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  section: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  bioText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillChip: {
    backgroundColor: '#f0f4ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e0e8ff',
  },
  skillText: {
    fontSize: 12,
    color: '#667eea',
    fontWeight: '600',
  },
  skillLevel: {
    fontSize: 10,
    color: '#999',
    marginTop: 2,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  contactText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  bottomSpacing: {
    height: 40,
  },
});