import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { getOrCreateConversation } from '../../store/slices/conversationsSlice';
import { fetchConnections } from '../../store/slices/connectionsSlice';
import { getPersonaImage } from '../../utils/personas';

interface NewChatScreenProps {
  navigation: any;
}

interface User {
  id: string;
  name: string;
  avatar?: string;
  persona_id?: string;
  occupation?: string;
  company?: string;
  location?: string;
}

export default function NewChatScreen({ navigation }: NewChatScreenProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { connections, loading: connectionsLoading } = useSelector((state: RootState) => state.connections);
  const { loading: conversationLoading } = useSelector((state: RootState) => state.conversations);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchConnections(user.id));
    }
  }, [dispatch, user?.id]);

  useEffect(() => {
    // Convert connections to users array and filter by search
    const users: User[] = connections
      .filter(connection => connection.status === 'accepted')
      .map(connection => ({
        id: connection.follower_id === user?.id ? connection.following_id : connection.follower_id,
        name: connection.follower_id === user?.id ? connection.following?.name : connection.follower?.name,
        avatar: connection.follower_id === user?.id ? connection.following?.avatar : connection.follower?.avatar,
        persona_id: connection.follower_id === user?.id ? connection.following?.persona_id : connection.follower?.persona_id,
        occupation: connection.follower_id === user?.id ? connection.following?.occupation : connection.follower?.occupation,
        company: connection.follower_id === user?.id ? connection.following?.company : connection.follower?.company,
        location: connection.follower_id === user?.id ? connection.following?.location : connection.follower?.location,
      }))
      .filter(userItem => userItem.name && userItem.id !== user?.id);

    if (searchQuery.trim()) {
      const filtered = users.filter(userItem =>
        userItem.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        userItem.occupation?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        userItem.company?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [connections, searchQuery, user?.id]);

  const getProfileImage = (userProfile: User) => {
    if (userProfile?.persona_id) {
      const personaImage = getPersonaImage(userProfile.persona_id);
      if (personaImage) return personaImage;
    }
    if (userProfile?.avatar) {
      return { uri: userProfile.avatar };
    }
    return { 
      uri: `https://ui-avatars.com/api/?name=${encodeURIComponent(userProfile?.name || 'User')}&background=2563eb&color=fff` 
    };
  };

  const handleStartChat = async (selectedUser: User) => {
    if (!user?.id) {
      Alert.alert('Erro', 'Usuário não autenticado');
      return;
    }

    try {
      const conversation = await dispatch(getOrCreateConversation({
        userId1: user.id,
        userId2: selectedUser.id
      })).unwrap();

      // Navigate to chat with the conversation
      navigation.replace('ChatDetail', {
        conversationId: conversation.id,
        otherUser: selectedUser
      });
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao criar conversa');
    }
  };

  const renderUserItem = ({ item }: { item: User }) => (
    <TouchableOpacity 
      style={styles.userItem}
      onPress={() => handleStartChat(item)}
      disabled={conversationLoading}
    >
      <Image
        source={getProfileImage(item)}
        style={styles.avatar}
      />
      
      <View style={styles.userInfo}>
        <Text style={styles.userName} numberOfLines={1}>
          {item.name}
        </Text>
        
        <View style={styles.userDetails}>
          {item.occupation && (
            <Text style={styles.userOccupation} numberOfLines={1}>
              {item.occupation}
              {item.company && ` • ${item.company}`}
            </Text>
          )}
          {item.location && (
            <Text style={styles.userLocation} numberOfLines={1}>
              📍 {item.location}
            </Text>
          )}
        </View>
      </View>
      
      <View style={styles.chatButton}>
        <Ionicons name="chatbubble-outline" size={20} color="#3b82f6" />
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => {
    if (connectionsLoading) {
      return (
        <View style={styles.emptyState}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text style={styles.loadingText}>Carregando conexões...</Text>
        </View>
      );
    }

    if (searchQuery.trim() && filteredUsers.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Ionicons name="search-outline" size={64} color="#9ca3af" />
          <Text style={styles.emptyTitle}>Nenhum resultado</Text>
          <Text style={styles.emptySubtitle}>
            Tente buscar por outro nome ou profissão
          </Text>
        </View>
      );
    }

    if (filteredUsers.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Ionicons name="people-outline" size={64} color="#9ca3af" />
          <Text style={styles.emptyTitle}>Nenhuma conexão encontrada</Text>
          <Text style={styles.emptySubtitle}>
            Conecte-se com outros usuários para poder conversar
          </Text>
          <TouchableOpacity 
            style={styles.exploreButton}
            onPress={() => navigation.navigate('Explore')}
          >
            <Ionicons name="compass-outline" size={20} color="white" />
            <Text style={styles.exploreButtonText}>Explorar Usuários</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return null;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#1f2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nova Conversa</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={20} color="#9ca3af" />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar conexões..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#9ca3af" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Results Info */}
      {filteredUsers.length > 0 && (
        <View style={styles.resultsInfo}>
          <Text style={styles.resultsText}>
            {filteredUsers.length} conexão{filteredUsers.length !== 1 ? 'ões' : ''} 
            {searchQuery.trim() ? ' encontrada' + (filteredUsers.length !== 1 ? 's' : '') : ''}
          </Text>
        </View>
      )}

      {/* Users List */}
      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id}
        renderItem={renderUserItem}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
        style={styles.usersList}
        contentContainerStyle={filteredUsers.length === 0 ? styles.emptyListContainer : undefined}
      />

      {/* Loading Overlay */}
      {conversationLoading && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingCard}>
            <ActivityIndicator size="large" color="#3b82f6" />
            <Text style={styles.loadingOverlayText}>Iniciando conversa...</Text>
          </View>
        </View>
      )}
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#1f2937',
  },
  resultsInfo: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f9fafb',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  resultsText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  usersList: {
    flex: 1,
  },
  emptyListContainer: {
    flexGrow: 1,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    marginBottom: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  userDetails: {
    gap: 2,
  },
  userOccupation: {
    fontSize: 14,
    color: '#6b7280',
  },
  userLocation: {
    fontSize: 12,
    color: '#9ca3af',
  },
  chatButton: {
    padding: 12,
    backgroundColor: '#eff6ff',
    borderRadius: 12,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 64,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 32,
  },
  exploreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3b82f6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  exploreButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 16,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingCard: {
    backgroundColor: 'white',
    paddingHorizontal: 32,
    paddingVertical: 24,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  loadingOverlayText: {
    fontSize: 16,
    color: '#1f2937',
    marginTop: 12,
    fontWeight: '500',
  },
});