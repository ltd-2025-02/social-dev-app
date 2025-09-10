
import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import {
  fetchConversationMessages,
  sendMessage,
  markMessagesAsRead,
  setCurrentConversation,
  clearMessages,
} from '../../store/slices/conversationsSlice';
import { getPersonaImage } from '../../utils/personas';

interface ChatDetailScreenProps {
  route: {
    params: {
      conversationId: string;
      otherUser: any;
    };
  };
  navigation: any;
}

export default function ChatDetailScreen({ route, navigation }: ChatDetailScreenProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { messages, loading, sendingMessage, currentConversation } = useSelector((state: RootState) => state.conversations);
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [messageText, setMessageText] = useState('');
  const flatListRef = useRef<FlatList>(null);
  
  const { conversationId, otherUser } = route.params;

  useEffect(() => {
    if (conversationId && user?.id) {
      dispatch(fetchConversationMessages({ conversationId, userId: user.id }));
      dispatch(markMessagesAsRead({ conversationId, userId: user.id }));
    }
    
    return () => {
      dispatch(clearMessages());
      dispatch(setCurrentConversation(null));
    };
  }, [dispatch, conversationId, user?.id]);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0 && flatListRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length]);

  const handleSendMessage = async () => {
    if (!messageText.trim() || !user?.id) {
      return;
    }

    const tempMessage = messageText.trim();
    setMessageText('');

    try {
      await dispatch(sendMessage({
        conversationId,
        senderId: user.id,
        content: tempMessage
      })).unwrap();
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao enviar mensagem');
      setMessageText(tempMessage); // Restore message on error
    }
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

  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Agora';
    if (minutes < 60) return `${minutes}min`;
    if (hours < 24) return `${hours}h`;
    if (days === 1) return 'Ontem';
    if (days < 7) return `${days}d`;
    return date.toLocaleDateString();
  };

  const renderMessage = ({ item, index }: { item: any; index: number }) => {
    const isMyMessage = item.sender_id === user?.id;
    const isLastMessage = index === messages.length - 1;
    const nextMessage = index < messages.length - 1 ? messages[index + 1] : null;
    const showAvatar = !isMyMessage && (!nextMessage || nextMessage.sender_id !== item.sender_id);

    return (
      <View style={[
        styles.messageContainer,
        isMyMessage ? styles.myMessageContainer : styles.otherMessageContainer
      ]}>
        {showAvatar && (
          <Image
            source={getProfileImage(otherUser)}
            style={styles.messageAvatar}
          />
        )}
        
        <View style={[
          styles.messageBubble,
          isMyMessage ? styles.myMessageBubble : styles.otherMessageBubble,
          !showAvatar && !isMyMessage ? styles.messageWithoutAvatar : null
        ]}>
          <Text style={[
            styles.messageText,
            isMyMessage ? styles.myMessageText : styles.otherMessageText
          ]}>
            {item.content}
          </Text>
          <Text style={[
            styles.messageTime,
            isMyMessage ? styles.myMessageTime : styles.otherMessageTime
          ]}>
            {formatMessageTime(item.created_at)}
          </Text>
        </View>
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Image
        source={getProfileImage(otherUser)}
        style={styles.emptyAvatar}
      />
      <Text style={styles.emptyTitle}>
        Conversa com {otherUser?.name}
      </Text>
      <Text style={styles.emptySubtitle}>
        Envie uma mensagem para começar a conversa
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()} 
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#1f2937" />
          </TouchableOpacity>
          
          <View style={styles.headerUser}>
            <Image
              source={getProfileImage(otherUser)}
              style={styles.headerAvatar}
            />
            <View style={styles.headerUserInfo}>
              <Text style={styles.headerUserName} numberOfLines={1}>
                {otherUser?.name || 'Usuário'}
              </Text>
              <Text style={styles.headerUserStatus}>Online</Text>
            </View>
          </View>
          
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="call-outline" size={24} color="#3b82f6" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="videocam-outline" size={24} color="#3b82f6" />
          </TouchableOpacity>
        </View>

        {/* Messages */}
        <View style={styles.messagesContainer}>
          {loading && messages.length === 0 ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#3b82f6" />
              <Text style={styles.loadingText}>Carregando mensagens...</Text>
            </View>
          ) : (
            <FlatList
              ref={flatListRef}
              data={messages}
              keyExtractor={(item) => item.id}
              renderItem={renderMessage}
              ListEmptyComponent={renderEmptyState}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.messagesList}
              onContentSizeChange={() => {
                if (messages.length > 0) {
                  flatListRef.current?.scrollToEnd({ animated: false });
                }
              }}
            />
          )}
        </View>

        {/* Input */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.messageInput}
              placeholder="Digite uma mensagem..."
              value={messageText}
              onChangeText={setMessageText}
              multiline
              maxLength={1000}
              textAlignVertical="top"
            />
            <TouchableOpacity style={styles.attachButton}>
              <Ionicons name="attach" size={20} color="#6b7280" />
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity
            style={[
              styles.sendButton,
              (!messageText.trim() || sendingMessage) && styles.sendButtonDisabled
            ]}
            onPress={handleSendMessage}
            disabled={!messageText.trim() || sendingMessage}
          >
            {sendingMessage ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Ionicons name="send" size={20} color="white" />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
    marginRight: 8,
  },
  headerUser: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  headerUserInfo: {
    flex: 1,
  },
  headerUserName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  headerUserStatus: {
    fontSize: 12,
    color: '#10b981',
  },
  headerButton: {
    padding: 8,
    marginLeft: 8,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesList: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-end',
  },
  myMessageContainer: {
    justifyContent: 'flex-end',
  },
  otherMessageContainer: {
    justifyContent: 'flex-start',
  },
  messageAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  messageBubble: {
    maxWidth: '75%',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 18,
  },
  myMessageBubble: {
    backgroundColor: '#3b82f6',
    marginLeft: 48,
  },
  otherMessageBubble: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  messageWithoutAvatar: {
    marginLeft: 32,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
    marginBottom: 4,
  },
  myMessageText: {
    color: 'white',
  },
  otherMessageText: {
    color: '#1f2937',
  },
  messageTime: {
    fontSize: 11,
  },
  myMessageTime: {
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'right',
  },
  otherMessageTime: {
    color: '#9ca3af',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 64,
  },
  emptyAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    gap: 12,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#f9fafb',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 40,
    maxHeight: 120,
  },
  messageInput: {
    flex: 1,
    fontSize: 16,
    color: '#1f2937',
    maxHeight: 100,
    paddingVertical: 4,
  },
  attachButton: {
    padding: 4,
    marginLeft: 8,
  },
  sendButton: {
    backgroundColor: '#3b82f6',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
});
