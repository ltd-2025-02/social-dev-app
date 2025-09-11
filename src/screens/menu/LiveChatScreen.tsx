import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'support';
  timestamp: Date;
  supportAgent?: {
    name: string;
    avatar: string;
  };
}

const supportAgents = [
  { name: 'Ana Silva', avatar: '👩‍💻', status: 'online' },
  { name: 'Carlos Santos', avatar: '👨‍💻', status: 'online' },
  { name: 'Maria Oliveira', avatar: '👩‍🔧', status: 'busy' },
];

export default function LiveChatScreen({ navigation }: any) {
  const { user } = useSelector((state: RootState) => state.auth);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [currentAgent, setCurrentAgent] = useState<any>(null);
  const [typingAgent, setTypingAgent] = useState<string | null>(null);
  const flatListRef = useRef<FlatList>(null);

  // Simular conexão com suporte
  const connectToSupport = () => {
    setIsConnecting(true);
    
    setTimeout(() => {
      const availableAgents = supportAgents.filter(agent => agent.status === 'online');
      if (availableAgents.length > 0) {
        const agent = availableAgents[Math.floor(Math.random() * availableAgents.length)];
        setCurrentAgent(agent);
        setIsConnected(true);
        setIsConnecting(false);
        
        // Mensagem de boas-vindas
        const welcomeMessage: ChatMessage = {
          id: Date.now().toString(),
          text: `Olá ${user?.name || 'usuário'}! Eu sou ${agent.name} e vou te ajudar hoje. Como posso ajudá-lo?`,
          sender: 'support',
          timestamp: new Date(),
          supportAgent: agent,
        };
        
        setMessages([welcomeMessage]);
      } else {
        setIsConnecting(false);
        Alert.alert(
          'Suporte Indisponível',
          'Todos os nossos agentes estão ocupados no momento. Tente novamente em alguns minutos ou use nosso email: suporte@socialdev.com',
          [{ text: 'OK' }]
        );
      }
    }, 2000);
  };

  const sendMessage = () => {
    if (!inputText.trim() || !isConnected) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');

    // Simular resposta do agente
    setTypingAgent(currentAgent?.name);
    
    setTimeout(() => {
      setTypingAgent(null);
      const responses = [
        'Entendi sua questão. Deixe-me verificar isso para você.',
        'Obrigado pela informação. Vou te ajudar com isso agora.',
        'Posso entender sua preocupação. Vamos resolver isso juntos.',
        'Excelente pergunta! Vou explicar como funciona.',
        'Vou encaminhar sua solicitação para o departamento apropriado.',
        'Essa é uma funcionalidade que estamos trabalhando para implementar.',
      ];
      
      const responseText = responses[Math.floor(Math.random() * responses.length)];
      
      const responseMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: 'support',
        timestamp: new Date(),
        supportAgent: currentAgent,
      };

      setMessages(prev => [...prev, responseMessage]);
    }, 1500 + Math.random() * 2000);
  };

  const endChat = () => {
    Alert.alert(
      'Encerrar Chat',
      'Tem certeza que deseja encerrar esta conversa?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Encerrar',
          style: 'destructive',
          onPress: () => {
            setIsConnected(false);
            setCurrentAgent(null);
            setMessages([]);
            navigation.goBack();
          }
        }
      ]
    );
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => (
    <View style={[
      styles.messageContainer,
      item.sender === 'user' ? styles.userMessage : styles.supportMessage
    ]}>
      {item.sender === 'support' && (
        <View style={styles.agentInfo}>
          <Text style={styles.agentAvatar}>{item.supportAgent?.avatar}</Text>
          <Text style={styles.agentName}>{item.supportAgent?.name}</Text>
        </View>
      )}
      <View style={[
        styles.messageBubble,
        item.sender === 'user' ? styles.userBubble : styles.supportBubble
      ]}>
        <Text style={[
          styles.messageText,
          item.sender === 'user' ? styles.userMessageText : styles.supportMessageText
        ]}>
          {item.text}
        </Text>
      </View>
      <Text style={styles.messageTime}>
        {formatTime(item.timestamp)}
      </Text>
    </View>
  );

  const renderTypingIndicator = () => {
    if (!typingAgent) return null;
    
    return (
      <View style={styles.typingContainer}>
        <View style={styles.typingBubble}>
          <Text style={styles.typingText}>{typingAgent} está digitando</Text>
          <View style={styles.typingDots}>
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>
        </View>
      </View>
    );
  };

  if (!isConnected && !isConnecting) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#1f2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Chat ao Vivo</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.welcomeContainer}>
          <View style={styles.welcomeContent}>
            <Ionicons name="chatbubbles" size={64} color="#3b82f6" />
            <Text style={styles.welcomeTitle}>Suporte ao Vivo</Text>
            <Text style={styles.welcomeText}>
              Conecte-se com nossa equipe de suporte para obter ajuda imediata com suas dúvidas e problemas.
            </Text>
            
            <View style={styles.agentsSection}>
              <Text style={styles.agentsTitle}>Agentes Disponíveis</Text>
              {supportAgents.map((agent, index) => (
                <View key={index} style={styles.agentCard}>
                  <Text style={styles.agentCardAvatar}>{agent.avatar}</Text>
                  <View style={styles.agentCardInfo}>
                    <Text style={styles.agentCardName}>{agent.name}</Text>
                    <View style={styles.statusContainer}>
                      <View style={[
                        styles.statusDot,
                        { backgroundColor: agent.status === 'online' ? '#10b981' : '#f59e0b' }
                      ]} />
                      <Text style={styles.statusText}>
                        {agent.status === 'online' ? 'Disponível' : 'Ocupado'}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>

            <TouchableOpacity style={styles.connectButton} onPress={connectToSupport}>
              <Ionicons name="chatbubble-ellipses" size={20} color="#fff" />
              <Text style={styles.connectButtonText}>Iniciar Chat</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (isConnecting) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#1f2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Conectando...</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.connectingContainer}>
          <View style={styles.loadingSpinner}>
            <Ionicons name="chatbubbles" size={48} color="#3b82f6" />
          </View>
          <Text style={styles.connectingTitle}>Conectando ao suporte...</Text>
          <Text style={styles.connectingText}>
            Aguarde enquanto encontramos um agente disponível para ajudá-lo.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={endChat}>
          <Ionicons name="close" size={24} color="#1f2937" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>{currentAgent?.name}</Text>
          <Text style={styles.headerSubtitle}>Suporte • Online</Text>
        </View>
        <TouchableOpacity onPress={endChat}>
          <Ionicons name="ellipsis-horizontal" size={24} color="#1f2937" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView 
        style={styles.chatContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContent}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          ListFooterComponent={renderTypingIndicator}
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Digite sua mensagem..."
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
            onPress={sendMessage}
            disabled={!inputText.trim()}
          >
            <Ionicons 
              name="send" 
              size={20} 
              color={inputText.trim() ? "#fff" : "#9ca3af"} 
            />
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
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#10b981',
    marginTop: 2,
  },
  headerInfo: {
    flex: 1,
    marginLeft: 16,
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  welcomeContent: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 32,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 16,
    marginBottom: 12,
  },
  welcomeText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  agentsSection: {
    width: '100%',
    marginBottom: 32,
  },
  agentsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  agentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    marginBottom: 8,
  },
  agentCardAvatar: {
    fontSize: 24,
    marginRight: 12,
  },
  agentCardInfo: {
    flex: 1,
  },
  agentCardName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: '#6b7280',
  },
  connectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3b82f6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  connectButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    marginLeft: 8,
  },
  connectingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  loadingSpinner: {
    marginBottom: 24,
  },
  connectingTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  connectingText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  chatContainer: {
    flex: 1,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
  },
  messageContainer: {
    marginBottom: 16,
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  supportMessage: {
    alignItems: 'flex-start',
  },
  agentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  agentAvatar: {
    fontSize: 16,
    marginRight: 6,
  },
  agentName: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
  },
  userBubble: {
    backgroundColor: '#3b82f6',
  },
  supportBubble: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  userMessageText: {
    color: '#fff',
  },
  supportMessageText: {
    color: '#1f2937',
  },
  messageTime: {
    fontSize: 10,
    color: '#9ca3af',
    marginTop: 4,
  },
  typingContainer: {
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  typingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    maxWidth: '80%',
  },
  typingText: {
    fontSize: 14,
    color: '#6b7280',
    fontStyle: 'italic',
    marginRight: 8,
  },
  typingDots: {
    flexDirection: 'row',
  },
  dot: {
    width: 4,
    height: 4,
    backgroundColor: '#9ca3af',
    borderRadius: 2,
    marginHorizontal: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    maxHeight: 100,
    marginRight: 12,
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
    backgroundColor: '#f3f4f6',
  },
});