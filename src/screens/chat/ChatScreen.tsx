
import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  RefreshControl,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { fetchConversations, clearError } from '../../store/slices/conversationsSlice';
import { getPersonaImage } from '../../utils/personas';

interface ChatScreenProps {
  navigation: any;
}

export default function ChatScreen({ navigation }: ChatScreenProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { conversations, loading, error } = useSelector((state: RootState) => state.conversations);
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchConversations(user.id));
    }
  }, [dispatch, user?.id]);

  const onRefresh = useCallback(async () => {
    if (!user?.id) return;
    
    setRefreshing(true);
    try {
      await dispatch(fetchConversations(user.id)).unwrap();
    } catch (error) {
      console.error('Error refreshing conversations:', error);
    } finally {
      setRefreshing(false);
    }
  }, [dispatch, user?.id]);

  const handleConversationPress = (conversation: any) => {
    navigation.navigate('ChatDetail', { 
      conversationId: conversation.id,
      otherUser: conversation.other_participant 
    });
  };

  const handleNewChat = () => {
    navigation.navigate('NewChat');
  };

  const getProfileImage = (userProfile: any) => {
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

  const formatLastMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes}min`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    return date.toLocaleDateString();
  };

  const filteredConversations = conversations.filter(conversation =>
    conversation.other_participant?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderConversationItem = ({ item }: { item: any }) => {
    const otherUser = item.other_participant;
    const lastMessage = item.last_message;
    const unreadCount = item.unread_count || 0;

    return (
      <View style={styles.conversationItemContainer}>
        <TouchableOpacity 
          style={styles.conversationItem}
          onPress={() => handleConversationPress(item)}
          activeOpacity={0.7}
        >
          <View style={styles.conversationContent}>
            <View style={styles.avatarContainer}>
              <Image
                source={getProfileImage(otherUser)}
                style={styles.avatar}
              />
              {unreadCount > 0 && <View style={styles.onlineIndicator} />}
            </View>
            
            <View style={styles.conversationInfo}>
              <View style={styles.conversationHeader}>
                <Text style={styles.userName} numberOfLines={1}>
                  {otherUser?.name || 'Usuário'}
                </Text>
                {lastMessage && (
                  <Text style={styles.timestamp}>
                    {formatLastMessageTime(lastMessage.created_at)}
                  </Text>
                )}
              </View>
              
              <View style={styles.messagePreview}>
                <Text 
                  style={[
                    styles.lastMessage, 
                    unreadCount > 0 && styles.unreadMessage
                  ]} 
                  numberOfLines={1}
                >
                  {lastMessage ? lastMessage.content : 'Sem mensagens ainda'}
                </Text>
                {unreadCount > 0 && (
                  <View style={styles.unreadBadge}>
                    <Text style={styles.unreadCount}>
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </Text>
                  </View>
                )}
              </View>
            </View>
            
            <View style={styles.chevronContainer}>
              <Ionicons name="chevron-forward" size={16} color="#c1c1c1" />
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="chatbubbles-outline" size={64} color="#9ca3af" />
      <Text style={styles.emptyTitle}>Nenhuma conversa ainda</Text>
      <Text style={styles.emptySubtitle}>
        Inicie uma nova conversa com seus conexões
      </Text>
      <TouchableOpacity style={styles.startChatButton} onPress={handleNewChat}>
        <Ionicons name="add" size={20} color="white" />
        <Text style={[styles.startChatText, { marginLeft: 8 }]}>Nova Conversa</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading && conversations.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Conversas</Text>
            <Text style={styles.subtitle}>Carregando conversas...</Text>
          </View>
          <TouchableOpacity style={styles.headerButton} onPress={handleNewChat}>
            <Ionicons name="create-outline" size={24} color="#333" />
          </TouchableOpacity>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text style={styles.loadingText}>Carregando conversas...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Conversas</Text>
            <Text style={styles.subtitle}>Erro ao carregar</Text>
          </View>
          <TouchableOpacity style={styles.headerButton} onPress={handleNewChat}>
            <Ionicons name="create-outline" size={24} color="#333" />
          </TouchableOpacity>
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color="#ef4444" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => {
              dispatch(clearError());
              if (user?.id) {
                dispatch(fetchConversations(user.id));
              }
            }}
          >
            <Text style={styles.retryButtonText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Conversas</Text>
          <Text style={styles.subtitle}>
            {conversations.length > 0 
              ? `${conversations.length} conversa${conversations.length !== 1 ? 's' : ''}`
              : 'Nenhuma conversa'
            }
          </Text>
        </View>
        <TouchableOpacity style={styles.headerButton} onPress={handleNewChat}>
          <Ionicons name="create-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>
      
      {/* Search Bar */}
      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#9ca3af" />
          <TextInput
            style={[styles.searchInput, { marginHorizontal: 8 }]}
            placeholder="Buscar conversas..."
            placeholderTextColor="#9ca3af"
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

      {/* Conversations List */}
      <FlatList
        data={filteredConversations}
        keyExtractor={(item) => item.id}
        renderItem={renderConversationItem}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#3b82f6"
          />
        }
        style={styles.conversationsList}
        contentContainerStyle={styles.listContent}
      />
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
  headerButton: {
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
    paddingHorizontal: 20,
    marginBottom: 16,
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
  conversationsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  listContent: {
    paddingBottom: 100,
  },
  conversationItemContainer: {
    marginBottom: 12,
  },
  conversationItem: {
    backgroundColor: 'white',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  conversationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 3,
    borderColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#10b981',
    borderWidth: 2,
    borderColor: 'white',
  },
  conversationInfo: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  userName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1f2937',
    flex: 1,
  },
  timestamp: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '500',
  },
  messagePreview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    fontSize: 14,
    color: '#6b7280',
    flex: 1,
    lineHeight: 20,
  },
  unreadMessage: {
    fontWeight: '600',
    color: '#374151',
  },
  unreadBadge: {
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    minWidth: 22,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
    marginLeft: 8,
  },
  unreadCount: {
    color: 'white',
    fontSize: 11,
    fontWeight: '700',
  },
  chevronContainer: {
    marginLeft: 8,
    opacity: 0.5,
  },
  emptyState: {
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
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 24,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  startChatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3b82f6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  startChatText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
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
    fontSize: 16,
    color: '#6b7280',
    marginTop: 16,
  },
  errorContainer: {
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
  errorText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
    lineHeight: 24,
  },
  retryButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
