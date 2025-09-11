import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Alert,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { GeminiService } from '../../services/geminiService';
import MarkdownRenderer from '../../components/MarkdownRenderer';

interface InterviewMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  parsedContent?: Array<{ type: 'text' | 'code'; content: string; language?: string }>;
  isQuestion?: boolean;
  difficulty?: 'easy' | 'medium' | 'hard';
  category?: 'technical' | 'behavioral' | 'situational';
}

interface InterviewData {
  currentQuestion: number;
  totalQuestions: number;
  score: number;
  responses: {
    question: string;
    answer: string;
    score: number;
    feedback: string;
  }[];
  level: string;
  skills: string[];
  timeSpent: number;
}

interface InterviewSimulatorScreenProps {
  navigation: any;
  route: any;
}

export default function InterviewSimulatorScreen({ navigation, route }: InterviewSimulatorScreenProps) {
  const generateUniqueId = () => {
    return `interview-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const [messages, setMessages] = useState<InterviewMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [interviewData, setInterviewData] = useState<InterviewData>({
    currentQuestion: 0,
    totalQuestions: 8,
    score: 0,
    responses: [],
    level: route.params?.level || 'Mid',
    skills: route.params?.skills?.map((s: any) => s.skill) || ['React', 'JavaScript'],
    timeSpent: 0,
  });
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [interviewPhase, setInterviewPhase] = useState<'intro' | 'interview' | 'complete'>('intro');
  
  const flatListRef = useRef<FlatList>(null);
  const typingAnim = useRef(new Animated.Value(0)).current;
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!interviewStarted) {
      initializeInterview();
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

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

  const initializeInterview = async () => {
    const welcomeMessage = `👋 **Olá! Bem-vindo ao Simulador de Entrevistas IA**

Sou seu entrevistador virtual especializado em tecnologia. Vou conduzir uma entrevista completa baseada no seu nível **${interviewData.level}** e nas suas habilidades.

🎯 **Como funciona:**
• ${interviewData.totalQuestions} perguntas personalizadas
• Mistura de questões técnicas e comportamentais  
• Feedback detalhado em tempo real
• Avaliação final com nível do candidato

⏱️ **Dicas importantes:**
• Seja específico e dê exemplos práticos
• Não há tempo limite, mas seja conciso
• Você pode pedir esclarecimentos a qualquer momento

**Pronto para começar?** Clique em "Iniciar Entrevista" quando estiver preparado!`;

    const parsedContent = GeminiService.extractCodeBlocks(welcomeMessage);
    
    const aiMessage: InterviewMessage = {
      id: generateUniqueId(),
      text: welcomeMessage,
      isUser: false,
      timestamp: new Date(),
      parsedContent,
    };
    
    setMessages([aiMessage]);
  };

  const startInterview = async () => {
    setInterviewStarted(true);
    setInterviewPhase('interview');
    
    // Start timer
    timerRef.current = setInterval(() => {
      setInterviewData(prev => ({
        ...prev,
        timeSpent: prev.timeSpent + 1
      }));
    }, 1000);

    await askNextQuestion();
  };

  const askNextQuestion = async () => {
    setIsLoading(true);
    startTypingAnimation();

    try {
      const questionPrompt = `
      Você é um entrevistador técnico especializado. Gere uma pergunta de entrevista para um desenvolvedor nível ${interviewData.level}.
      
      Contexto:
      - Pergunta ${interviewData.currentQuestion + 1} de ${interviewData.totalQuestions}
      - Habilidades principais: ${interviewData.skills.join(', ')}
      - Nível: ${interviewData.level}
      
      Tipos de pergunta (alterne entre eles):
      - Técnica: Conceitos, algoritmos, arquitetura
      - Comportamental: Experiências, desafios, liderança  
      - Situacional: Resolução de problemas, cenários reais
      
      Formate como:
      **Pergunta ${interviewData.currentQuestion + 1}/${interviewData.totalQuestions}** - [Categoria]
      
      [Sua pergunta aqui]
      
      *Dica: [Uma dica útil para responder bem]*
      `;

      const response = await GeminiService.sendMessage(questionPrompt);
      const parsedContent = GeminiService.extractCodeBlocks(response);
      
      const questionMessage: InterviewMessage = {
        id: generateUniqueId(),
        text: response,
        isUser: false,
        timestamp: new Date(),
        parsedContent,
        isQuestion: true,
      };

      setMessages(prev => [...prev, questionMessage]);
      
    } catch (error) {
      console.error('Erro ao gerar pergunta:', error);
      Alert.alert('Erro', 'Não foi possível gerar a pergunta. Tente novamente.');
    } finally {
      stopTypingAnimation();
      setIsLoading(false);
    }
  };

  const evaluateResponse = async (userAnswer: string) => {
    setIsLoading(true);
    startTypingAnimation();

    try {
      const evaluationPrompt = `
      Você é um entrevistador especializado avaliando uma resposta de entrevista.
      
      Pergunta atual: ${interviewData.currentQuestion + 1}/${interviewData.totalQuestions}
      Nível do candidato: ${interviewData.level}
      
      Resposta do candidato: "${userAnswer}"
      
      Forneça:
      1. **Feedback**: Análise detalhada da resposta (2-3 frases)
      2. **Pontos positivos**: O que foi bem na resposta
      3. **Melhorias**: Como poderia ser aprimorada
      4. **Nota**: Score de 0-10 baseado em:
         - Clareza e estrutura da resposta
         - Conhecimento técnico demonstrado
         - Exemplos práticos fornecidos
         - Adequação ao nível esperado
      
      **Feedback da Resposta:**
      [Seu feedback aqui]
      
      **Nota: X/10**
      `;

      const response = await GeminiService.sendMessage(evaluationPrompt);
      const parsedContent = GeminiService.extractCodeBlocks(response);
      
      // Extract score from response
      const scoreMatch = response.match(/Nota:\s*(\d+)\/10/);
      const score = scoreMatch ? parseInt(scoreMatch[1]) : 5;
      
      // Save response data
      const currentResponses = [...interviewData.responses];
      const lastQuestion = messages.filter(m => m.isQuestion).pop();
      
      if (lastQuestion) {
        currentResponses.push({
          question: lastQuestion.text,
          answer: userAnswer,
          score: score,
          feedback: response,
        });
      }

      setInterviewData(prev => ({
        ...prev,
        responses: currentResponses,
        score: prev.score + score,
        currentQuestion: prev.currentQuestion + 1,
      }));

      const feedbackMessage: InterviewMessage = {
        id: generateUniqueId(),
        text: response,
        isUser: false,
        timestamp: new Date(),
        parsedContent,
      };

      setMessages(prev => [...prev, feedbackMessage]);

      // Check if interview is complete
      if (interviewData.currentQuestion + 1 >= interviewData.totalQuestions) {
        setTimeout(() => {
          completeInterview();
        }, 2000);
      } else {
        setTimeout(() => {
          askNextQuestion();
        }, 2000);
      }
      
    } catch (error) {
      console.error('Erro na avaliação:', error);
      Alert.alert('Erro', 'Não foi possível avaliar a resposta. Tente novamente.');
    } finally {
      stopTypingAnimation();
      setIsLoading(false);
    }
  };

  const completeInterview = async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    setInterviewPhase('complete');
    
    const averageScore = interviewData.score / interviewData.totalQuestions;
    const performanceLevel = getPerformanceLevel(averageScore);
    const timeInMinutes = Math.floor(interviewData.timeSpent / 60);
    
    const finalMessage = `🎉 **Entrevista Concluída!**

## 📊 **Resultados Finais**

**Score Médio:** ${averageScore.toFixed(1)}/10
**Nível de Performance:** ${performanceLevel}
**Tempo Total:** ${timeInMinutes} minutos
**Perguntas Respondidas:** ${interviewData.totalQuestions}

## 🎯 **Avaliação Geral**

${getDetailedFeedback(averageScore, performanceLevel)}

## 📈 **Próximos Passos**

${getNextStepsRecommendations(averageScore, interviewData.level)}

**Parabéns pelo esforço!** 🚀`;

    const parsedContent = GeminiService.extractCodeBlocks(finalMessage);
    
    const finalResultMessage: InterviewMessage = {
      id: generateUniqueId(),
      text: finalMessage,
      isUser: false,
      timestamp: new Date(),
      parsedContent,
    };

    setMessages(prev => [...prev, finalResultMessage]);
  };

  const getPerformanceLevel = (averageScore: number) => {
    if (averageScore >= 8.5) return '🏆 Excelente';
    if (averageScore >= 7) return '🌟 Muito Bom';
    if (averageScore >= 5.5) return '✅ Bom';
    if (averageScore >= 4) return '⚠️ Regular';
    return '❌ Precisa Melhorar';
  };

  const getDetailedFeedback = (score: number, level: string) => {
    if (score >= 8.5) {
      return 'Excelente performance! Você demonstrou conhecimento sólido, comunicação clara e experiência prática. Está bem preparado para posições de nível sênior.';
    } else if (score >= 7) {
      return 'Muito bom desempenho! Você tem base técnica sólida, mas pode aprimorar alguns aspectos específicos para maximizar suas chances.';
    } else if (score >= 5.5) {
      return 'Bom desempenho geral. Você tem potencial, mas precisa aprofundar conhecimentos técnicos e melhorar a estruturação das respostas.';
    } else if (score >= 4) {
      return 'Performance regular. Recomendo mais estudos técnicos e prática em entrevistas antes de candidatar-se a posições.';
    }
    return 'Precisa de mais preparação. Foque em estudar conceitos fundamentais e pratique mais simulações de entrevista.';
  };

  const getNextStepsRecommendations = (score: number, level: string) => {
    const recommendations = [];
    
    if (score < 7) {
      recommendations.push('📚 **Estudo técnico**: Revise conceitos fundamentais das suas tecnologias principais');
      recommendations.push('💬 **Comunicação**: Pratique explicar conceitos técnicos de forma clara e objetiva');
    }
    
    if (score < 6) {
      recommendations.push('🎯 **Projetos práticos**: Desenvolva mais projetos para ter exemplos concretos');
    }
    
    if (score >= 7) {
      recommendations.push('🚀 **Candidaturas**: Você está pronto para se candidatar a vagas do seu nível');
      recommendations.push('📈 **Próximo nível**: Considere estudar temas de nível superior para evolução');
    }
    
    recommendations.push('🔄 **Prática contínua**: Refaça simulações periodicamente para manter-se afiado');
    
    return recommendations.join('\n');
  };

  const sendResponse = async () => {
    if (!inputText.trim() || isLoading || interviewPhase !== 'interview') return;

    const userMessage: InterviewMessage = {
      id: generateUniqueId(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    const currentAnswer = inputText.trim();
    setMessages(prev => [...prev, userMessage]);
    setInputText('');

    await evaluateResponse(currentAnswer);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderMessage = ({ item, index }: { item: InterviewMessage; index: number }) => (
    <View 
      key={`interview-msg-${item.id}-${index}`}
      style={[
        styles.messageContainer,
        item.isUser ? styles.userMessage : styles.aiMessage,
      ]}
    >
      {!item.isUser && (
        <View style={styles.aiAvatar}>
          <LinearGradient
            colors={item.isQuestion ? ['#8b5cf6', '#3b82f6'] : ['#10b981', '#059669']}
            style={styles.avatarGradient}
          >
            <Ionicons 
              name={item.isQuestion ? "help-circle" : "person"} 
              size={16} 
              color="#fff" 
            />
          </LinearGradient>
        </View>
      )}
      
      <View style={[
        styles.messageBubble,
        item.isUser ? styles.userBubble : styles.aiBubble,
        item.isQuestion && styles.questionBubble,
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
          <Ionicons name="person" size={16} color="#fff" />
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

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#1f2937" />
        </TouchableOpacity>
        
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>Simulador de Entrevista</Text>
          {interviewStarted && (
            <Text style={styles.headerSubtitle}>
              {interviewPhase === 'complete' ? 'Concluída' : `${interviewData.currentQuestion + 1}/${interviewData.totalQuestions} • ${formatTime(interviewData.timeSpent)}`}
            </Text>
          )}
        </View>

        <View style={styles.headerActions}>
          {interviewStarted && interviewPhase !== 'complete' && (
            <View style={styles.progressIndicator}>
              <Text style={styles.progressText}>
                {Math.round(((interviewData.currentQuestion) / interviewData.totalQuestions) * 100)}%
              </Text>
            </View>
          )}
        </View>
      </View>

      <KeyboardAvoidingView 
        style={styles.chatContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item, index) => `interview-${item.id}-${index}-${item.timestamp.getTime()}`}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContainer}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={isTyping ? <TypingIndicator /> : null}
        />

        {/* Start Button */}
        {!interviewStarted && (
          <View style={styles.startContainer}>
            <TouchableOpacity
              style={styles.startButton}
              onPress={startInterview}
            >
              <LinearGradient
                colors={['#3b82f6', '#8b5cf6']}
                style={styles.startGradient}
              >
                <Ionicons name="play" size={24} color="#fff" />
                <Text style={styles.startButtonText}>Iniciar Entrevista</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}

        {/* Input - Only show during interview phase */}
        {interviewPhase === 'interview' && (
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.textInput}
                placeholder="Digite sua resposta..."
                value={inputText}
                onChangeText={setInputText}
                multiline
                maxLength={1000}
                placeholderTextColor="#9ca3af"
              />
              <TouchableOpacity
                style={[
                  styles.sendButton,
                  inputText.trim() && !isLoading ? styles.sendButtonActive : null,
                ]}
                onPress={sendResponse}
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
        )}

        {/* Completion Actions */}
        {interviewPhase === 'complete' && (
          <View style={styles.completionActions}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('ResumeSelection')}
            >
              <Ionicons name="refresh" size={20} color="#3b82f6" />
              <Text style={styles.actionButtonText}>Nova Entrevista</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.primaryAction]}
              onPress={() => navigation.navigate('ResumeAnalysis', { mode: 'analyze' })}
            >
              <Ionicons name="analytics" size={20} color="#fff" />
              <Text style={[styles.actionButtonText, styles.primaryActionText]}>Ver Análise</Text>
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Styles would continue here...
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
  headerInfo: {
    flex: 1,
    marginLeft: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  headerActions: {
    alignItems: 'flex-end',
  },
  progressIndicator: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  progressText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
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
    maxWidth: '80%',
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
  questionBubble: {
    borderColor: '#8b5cf6',
    backgroundColor: '#faf5ff',
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
  startContainer: {
    padding: 20,
    alignItems: 'center',
  },
  startButton: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  startGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 16,
    gap: 12,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
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
    maxHeight: 120,
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
  completionActions: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    gap: 8,
  },
  primaryAction: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3b82f6',
  },
  primaryActionText: {
    color: '#fff',
  },
});