import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { GeminiService } from '../../services/geminiService';
import MarkdownRenderer from '../../components/MarkdownRenderer';
import { useTheme } from '../../contexts/ThemeContext';
import UniversalHeader from '../../components/UniversalHeader';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  hasCode?: boolean;
  parsedContent?: Array<{ type: 'text' | 'code'; content: string; language?: string }>;
}

interface AIChatScreenProps {
  navigation: any;
}


export default function AIChatScreen({ navigation }: AIChatScreenProps) {
  const { colors } = useTheme();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Olá! Sou seu assistente de IA especializado em desenvolvimento e carreira tech aqui no SocialDev. Como posso ajudá-lo hoje? 🤖\n\nPosso ajudar com:\n• **Programação** e desenvolvimento\n• **Carreira** em TI e tecnologia\n• **Trilhas de aprendizado** do app\n• **Códigos** com preview formatado\n• **Dicas profissionais** e mercado',
      isUser: false,
      timestamp: new Date(),
      hasCode: false,
      parsedContent: [
        {
          type: 'text',
          content: 'Olá! Sou seu assistente de IA especializado em desenvolvimento e carreira tech aqui no SocialDev. Como posso ajudá-lo hoje? 🤖\n\nPosso ajudar com:\n• **Programação** e desenvolvimento\n• **Carreira** em TI e tecnologia\n• **Trilhas de aprendizado** do app\n• **Códigos** com preview formatado\n• **Dicas profissionais** e mercado'
        }
      ]
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const typingAnim = useRef(new Animated.Value(0)).current;

  const startTypingAnimation = () => {
    setIsTyping(true);
    Animated.loop(
      Animated.sequence([
        Animated.timing(typingAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(typingAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const stopTypingAnimation = () => {
    setIsTyping(false);
    typingAnim.stopAnimation();
    typingAnim.setValue(0);
  };

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    const currentMessage = inputText.trim();
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    // Start typing animation
    startTypingAnimation();

    try {
      // Call Gemini AI
      const aiResponseText = await GeminiService.sendMessage(currentMessage);
      
      // Parse the response for code blocks
      const parsedContent = GeminiService.extractCodeBlocks(aiResponseText);
      const hasCode = parsedContent.some(block => block.type === 'code');
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponseText,
        isUser: false,
        timestamp: new Date(),
        hasCode,
        parsedContent,
      };

      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente em alguns instantes.',
        isUser: false,
        timestamp: new Date(),
        hasCode: false,
      };

      setMessages(prev => [...prev, errorMessage]);
      
      Alert.alert(
        'Erro de Conexão',
        'Não foi possível conectar ao assistente IA. Verifique sua conexão e tente novamente.',
        [{ text: 'OK' }]
      );
    } finally {
      stopTypingAnimation();
      setIsLoading(false);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[
      styles.messageContainer,
      item.isUser ? styles.userMessage : styles.aiMessage,
    ]}>
      {!item.isUser && (
        <View style={styles.aiAvatar}>
          <LinearGradient
            colors={['#8b5cf6', '#3b82f6']}
            style={styles.avatarGradient}
          >
            <Ionicons name="chatbot" size={16} color="#fff" />
          </LinearGradient>
        </View>
      )}
      
      <View style={[
        styles.messageBubble,
        item.isUser ? styles.userBubble : styles.aiBubble,
        item.hasCode && styles.codeBubble,
      ]}>
        {item.isUser ? (
          <Text style={[styles.messageText, styles.userText]}>
            {item.text}
          </Text>
        ) : (
          item.parsedContent ? (
            <MarkdownRenderer content={item.parsedContent} />
          ) : (
            <Text style={[styles.messageText, styles.aiText]}>
              {item.text}
            </Text>
          )
        )}
        
        <Text style={[
          styles.timestamp,
          item.isUser ? styles.userTimestamp : styles.aiTimestamp,
        ]}>
          {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    </View>
  );

  const TypingIndicator = () => (
    <View style={[styles.messageContainer, styles.aiMessage]}>
      <View style={styles.aiAvatar}>
        <LinearGradient
          colors={['#8b5cf6', '#3b82f6']}
          style={styles.avatarGradient}
        >
          <Ionicons name="chatbot" size={16} color="#fff" />
        </LinearGradient>
      </View>
      
      <View style={[styles.messageBubble, styles.aiBubble]}>
        <View style={styles.typingContainer}>
          {[0, 1, 2].map((index) => (
            <Animated.View
              key={index}
              style={[
                styles.typingDot,
                {
                  opacity: typingAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.3, 1],
                  }),
                  transform: [
                    {
                      scale: typingAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.8, 1.2],
                      }),
                    },
                  ],
                },
              ]}
            />
          ))}
        </View>
      </View>
    </View>
  );

  const [quickQuestions] = useState(() => GeminiService.getSmartQuestions());

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <UniversalHeader 
        title="IA Assistant" 
        showBackButton={true}
        rightActions={
          <TouchableOpacity style={styles.moreButton}>
            <Ionicons name="ellipsis-vertical" size={20} color={colors.textMuted} />
          </TouchableOpacity>
        }
      />

      <KeyboardAvoidingView 
        style={styles.chatContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContainer}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={isTyping ? <TypingIndicator /> : null}
        />

        {/* Quick Questions */}
        {messages.length === 1 && (
          <View style={styles.quickQuestionsContainer}>
            <Text style={styles.quickQuestionsTitle}>Perguntas rápidas:</Text>
            <View style={styles.quickQuestionsGrid}>
              {quickQuestions.map((question, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.quickQuestionButton}
                  onPress={() => {
                    setInputText(question);
                    setTimeout(() => sendMessage(), 100);
                  }}
                >
                  <Text style={styles.quickQuestionText}>{question}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Input */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              placeholder="Digite sua pergunta..."
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
              placeholderTextColor="#9ca3af"
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                inputText.trim() ? styles.sendButtonActive : null,
              ]}
              onPress={sendMessage}
              disabled={!inputText.trim() || isLoading || isTyping}
            >
              <Ionicons 
                name="send" 
                size={20} 
                color={inputText.trim() && !isLoading ? "#fff" : "#9ca3af"} 
              />
            </TouchableOpacity>
          </View>
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
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  aiHeaderAvatar: {
    marginRight: 12,
  },
  headerAvatarGradient: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#6b7280',
  },
  moreButton: {
    padding: 8,
  },
  chatContainer: {
    flex: 1,
  },
  messagesList: {
    flex: 1,
  },
  messagesContainer: {
    padding: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  userMessage: {
    justifyContent: 'flex-end',
  },
  aiMessage: {
    justifyContent: 'flex-start',
  },
  aiAvatar: {
    marginRight: 8,
  },
  avatarGradient: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageBubble: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 16,
  },
  userBubble: {
    backgroundColor: '#3b82f6',
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  codeBubble: {
    maxWidth: '90%',
    padding: 8,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  userText: {
    color: '#fff',
  },
  aiText: {
    color: '#1f2937',
  },
  timestamp: {
    fontSize: 11,
    marginTop: 4,
  },
  userTimestamp: {
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'right',
  },
  aiTimestamp: {
    color: '#9ca3af',
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#9ca3af',
    marginHorizontal: 2,
  },
  quickQuestionsContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  quickQuestionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  quickQuestionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  quickQuestionButton: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  quickQuestionText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '500',
  },
  inputContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#f9fafb',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  textInput: {
    flex: 1,
    maxHeight: 100,
    fontSize: 15,
    color: '#1f2937',
    paddingVertical: 8,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendButtonActive: {
    backgroundColor: '#3b82f6',
  },
});