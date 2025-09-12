import React, { useState, useRef, useEffect } from 'react';
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
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { ResumeService } from '../../services/resumeService';
import { ResumeData, ConversationState, ResumeStep, Education, Experience, Project, Language, Certificate } from '../../types/resume';
import MarkdownRenderer from '../../components/MarkdownRenderer';
import { GeminiService } from '../../services/geminiService';
import { resumeDraftService } from '../../services/resumeDraft.service';
import { savedResumeService } from '../../services/savedResume.service';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  hasCode?: boolean;
  parsedContent?: Array<{ type: 'text' | 'code'; content: string; language?: string }>;
  isPreview?: boolean;
}

interface ResumeBuilderScreenProps {
  navigation: any;
}

export default function ResumeBuilderScreen({ navigation }: ResumeBuilderScreenProps) {
  const { user } = useSelector((state: RootState) => state.auth);
  
  const generateUniqueId = () => {
    return `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationState, setConversationState] = useState<ConversationState>({
    currentStep: 'intro',
    resumeData: {
      personalInfo: { fullName: '', email: '', phone: '', address: '' },
      education: [],
      experience: [],
      projects: [],
      languages: [],
      certificates: [],
      skills: [],
    },
  });
  const [isDraftLoaded, setIsDraftLoaded] = useState(false);
  
  const flatListRef = useRef<FlatList>(null);
  const typingAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadDraftOrInitializeChat();
  }, []);

  // Auto-save draft whenever conversation state or messages change
  useEffect(() => {
    if (isDraftLoaded && user?.id && messages.length > 0) {
      saveDraftDebounced();
    }
  }, [conversationState, messages, isDraftLoaded, user?.id]);

  // Handle navigation back with draft check
  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e: any) => {
      if (!isDraftLoaded || !user?.id) return;
      
      const progress = resumeDraftService.calculateProgress(conversationState);
      if (progress > 0 && progress < 100) {
        // Save draft before leaving
        saveDraft();
      }
    });

    return unsubscribe;
  }, [navigation, conversationState, messages, isDraftLoaded, user?.id]);

  const loadDraftOrInitializeChat = async () => {
    if (!user?.id) {
      await initializeChat();
      return;
    }

    try {
      const draft = await resumeDraftService.loadDraft(user.id);
      
      if (draft && draft.progress < 100) {
        // Load existing draft
        setConversationState(draft.conversationState);
        setMessages(draft.messages as Message[]);
        setIsDraftLoaded(true);
        
        Alert.alert(
          '📄 Rascunho Encontrado',
          `Você tem um currículo em andamento (${draft.progress}% concluído). Vamos continuar de onde parou!`,
          [{ text: 'Continuar', style: 'default' }]
        );
      } else {
        // No draft or completed, start fresh
        await initializeChat();
      }
    } catch (error) {
      console.error('Erro ao carregar rascunho:', error);
      await initializeChat();
    }
  };

  const saveDraft = async () => {
    if (!user?.id) return;

    try {
      const progress = resumeDraftService.calculateProgress(conversationState);
      await resumeDraftService.saveDraft(user.id, conversationState, messages, progress);
    } catch (error) {
      console.error('Erro ao salvar rascunho:', error);
    }
  };

  // Debounced save to avoid too frequent saves
  const saveDraftDebounced = (() => {
    let timeoutId: NodeJS.Timeout;
    return () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        saveDraft();
      }, 2000); // Save after 2 seconds of inactivity
    };
  })();

  const initializeChat = async () => {
    setIsLoading(true);
    try {
      const welcomeMessage = await ResumeService.generateWelcomeMessage();
      const parsedContent = GeminiService.extractCodeBlocks(welcomeMessage);
      
      const aiMessage: Message = {
        id: generateUniqueId(),
        text: welcomeMessage,
        isUser: false,
        timestamp: new Date(),
        parsedContent,
      };
      
      setMessages([aiMessage]);
      setConversationState(prev => ({ ...prev, currentStep: 'personal', currentSubStep: 'fullName' }));
      setIsDraftLoaded(true);
    } catch (error) {
      console.error('Erro ao inicializar chat:', error);
    } finally {
      setIsLoading(false);
    }
  };

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

  const showPreview = () => {
    const previewText = ResumeService.generateResumePreview(conversationState.resumeData);
    const parsedContent = GeminiService.extractCodeBlocks(previewText);
    const timestamp = new Date();
    
    const previewMessage: Message = {
      id: `preview-${timestamp.getTime()}-${Math.random().toString(36).substr(2, 9)}`,
      text: previewText,
      isUser: false,
      timestamp,
      parsedContent,
      isPreview: true,
    };
    
    setMessages(prev => [...prev, previewMessage]);
  };

  const finishResume = async () => {
    try {
      if (!user?.id) {
        Alert.alert('Erro', 'Usuário não encontrado.');
        return;
      }

      // Criar título padrão baseado no nome do usuário
      const personalInfo = conversationState.resumeData?.personalInfo;
      const defaultTitle = `Currículo - ${personalInfo?.fullName || user.name || 'Usuário'} - ${new Date().toLocaleDateString('pt-BR')}`;

      // Verificar se os dados do currículo estão completos
      if (!conversationState.resumeData || !personalInfo) {
        Alert.alert('Erro', 'Dados do currículo incompletos. Continue preenchendo antes de salvar.');
        return;
      }

      // Perguntar nome do currículo
      Alert.prompt(
        '📄 Salvar Currículo',
        'Digite um nome para seu currículo:',
        [
          {
            text: 'Cancelar',
            style: 'cancel'
          },
          {
            text: 'Salvar',
            onPress: async (resumeTitle: string | undefined) => {
              try {
                const title = resumeTitle?.trim() || defaultTitle;
                
                // Salvar currículo completo no banco de dados
                const savedResume = await savedResumeService.saveResume(
                  user.id, 
                  conversationState.resumeData as any, 
                  title
                );

                // Mark resume as complete (100%) e remove draft
                await resumeDraftService.saveDraft(user.id, conversationState, messages, 100);
                await resumeDraftService.deleteDraft(user.id);

                const finalMessage: Message = {
                  id: generateUniqueId(),
                  text: `🎉 **Parabéns! Seu currículo "${title}" foi salvo com sucesso!**

✅ **Seu currículo está salvo no banco de dados e pode ser acessado em "Meus Currículos".**

📄 **Próximos passos:**
- Acesse "Meus Currículos" para visualizar, editar ou baixar
- Faça o download em PDF ou HTML
- Compartilhe com recrutadores
- Mantenha sempre atualizado

**Obrigado por usar o Construtor de Currículos do SocialDev!** 🚀`,
                  isUser: false,
                  timestamp: new Date(),
                };

                setMessages(prev => [...prev, finalMessage]);

                // Show completion alert with more options
                setTimeout(() => {
                  Alert.alert(
                    '🎉 Currículo Salvo!',
                    `"${title}" foi salvo com sucesso! O que você gostaria de fazer agora?`,
                    [
                      {
                        text: 'Ver Meus Currículos',
                        onPress: () => navigation.navigate('MyResumes')
                      },
                      {
                        text: 'Exportar como HTML',
                        onPress: async () => {
                          try {
                            Alert.alert('Exportar Currículo', 'A geração de PDF ainda não está disponível. Seu currículo será exportado como um arquivo HTML que pode ser aberto no navegador.');
                            await savedResumeService.downloadResume(savedResume, 'html');
                          } catch (error) {
                            console.error('Erro no download:', error);
                            Alert.alert('Erro de Exportação', 'Ocorreu um erro ao exportar seu currículo.');
                          }
                        }
                      },
                      {
                        text: 'Voltar ao Início',
                        onPress: () => navigation.navigate('Home')
                      }
                    ]
                  );
                }, 1500);

              } catch (error) {
                console.error('Erro ao salvar currículo:', error);
                Alert.alert(
                  'Erro ao Salvar',
                  `Não foi possível salvar o currículo no banco de dados. ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
                  [
                    {
                      text: 'Tentar Novamente',
                      onPress: async () => {
                        // Retry the save operation
                        try {
                          const title = resumeTitle?.trim() || defaultTitle;
                          const savedResume = await savedResumeService.saveResume(
                            user.id, 
                            conversationState.resumeData as any, 
                            title
                          );
                          Alert.alert('Sucesso!', 'Currículo salvo com sucesso!');
                          navigation.navigate('MyResumes');
                        } catch (retryError) {
                          console.error('Retry failed:', retryError);
                          Alert.alert('Erro', 'Falha na segunda tentativa. Por favor, verifique sua conexão e tente mais tarde.');
                        }
                      }
                    },
                    {
                      text: 'Cancelar',
                      style: 'cancel'
                    }
                  ]
                );
              }
            }
          }
        ],
        'plain-text',
        defaultTitle
      );

    } catch (error) {
      console.error('Erro ao finalizar currículo:', error);
      Alert.alert('Erro', 'Não foi possível finalizar o currículo. Tente novamente.');
    }
  };

  const processUserInput = async (userInput: string) => {
    const trimmedInput = userInput.trim().toLowerCase();
    
    // Check for preview command
    if (trimmedInput === 'preview' || trimmedInput === 'visualizar') {
      showPreview();
      return;
    }

    // Check for finish command
    if (trimmedInput === 'finalizar' || trimmedInput === 'finish' || trimmedInput === 'done') {
      await finishResume();
      return;
    }

    // Process based on current step
    switch (conversationState.currentStep) {
      case 'personal':
        await handlePersonalInfoStep(userInput);
        break;
      case 'education':
        await handleEducationStep(userInput);
        break;
      case 'experience':
        await handleExperienceStep(userInput);
        break;
      case 'projects':
        await handleProjectsStep(userInput);
        break;
      case 'languages':
        await handleLanguagesStep(userInput);
        break;
      case 'certificates':
        await handleCertificatesStep(userInput);
        break;
      case 'skills':
        await handleSkillsStep(userInput);
        break;
      case 'review':
        await handleReviewStep(userInput);
        break;
    }
  };

  const handlePersonalInfoStep = async (input: string) => {
    const { currentSubStep } = conversationState;
    let nextMessage = '';
    let nextSubStep = '';
    let nextStep: ResumeStep = 'personal';

    const updatePersonalInfo = (field: string, value: string) => {
      setConversationState(prev => ({
        ...prev,
        resumeData: {
          ...prev.resumeData,
          personalInfo: {
            ...prev.resumeData.personalInfo!,
            [field]: value,
          },
        },
      }));
    };

    switch (currentSubStep) {
      case 'fullName':
        updatePersonalInfo('fullName', input);
        nextMessage = `Perfeito, ${input}! 👍\n\nAgora preciso do seu **e-mail profissional** para contato:`;
        nextSubStep = 'email';
        break;
        
      case 'email':
        if (!ResumeService.validateEmail(input)) {
          nextMessage = 'Por favor, digite um e-mail válido (exemplo: seunome@email.com):';
          nextSubStep = 'email';
        } else {
          updatePersonalInfo('email', input);
          nextMessage = `Ótimo! 📧\n\nAgora me informe seu **número de telefone** com DDD (exemplo: (11) 99999-9999):`;
          nextSubStep = 'phone';
        }
        break;
        
      case 'phone':
        const formattedPhone = ResumeService.formatPhone(input);
        updatePersonalInfo('phone', formattedPhone);
        nextMessage = `Telefone registrado! 📱\n\n**Qual é o seu endereço?** (Cidade e estado já são suficientes):`;
        nextSubStep = 'address';
        break;
        
      case 'address':
        updatePersonalInfo('address', input);
        nextMessage = `Endereço salvo! 📍\n\n**Você possui algum site pessoal, LinkedIn, GitHub ou portfólio online?**\n\nSe sim, me envie o link. Se não, digite "não" para pularmos esta parte:`;
        nextSubStep = 'portfolio';
        break;
        
      case 'portfolio':
        if (input.toLowerCase() !== 'não' && input.toLowerCase() !== 'nao') {
          updatePersonalInfo('portfolioUrl', input);
          nextMessage = `Link adicionado! 🌐\n\n`;
        } else {
          nextMessage = `Sem problemas! 👍\n\n`;
        }
        nextMessage += `**Agora vamos para sua formação acadêmica! 🎓**\n\nQual nível de educação você gostaria de adicionar primeiro?\n\n1️⃣ Ensino Fundamental\n2️⃣ Ensino Médio\n3️⃣ Curso Técnico\n4️⃣ Ensino Superior\n5️⃣ Pós-graduação/Especialização\n6️⃣ MBA\n7️⃣ Mestrado\n8️⃣ Doutorado\n9️⃣ Pós-Doutorado\n\nDigite o número ou nome da opção:`;
        nextStep = 'education';
        nextSubStep = 'selectLevel';
        break;
    }

    const parsedContent = GeminiService.extractCodeBlocks(nextMessage);
    const aiMessage: Message = {
      id: generateUniqueId(),
      text: nextMessage,
      isUser: false,
      timestamp: new Date(),
      parsedContent,
    };

    setMessages(prev => [...prev, aiMessage]);
    setConversationState(prev => ({
      ...prev,
      currentStep: nextStep,
      currentSubStep: nextSubStep,
    }));
  };

  const handleEducationStep = async (input: string) => {
    const { currentSubStep } = conversationState;
    let nextMessage = '';
    let nextSubStep = '';

    const educationLevels = {
      '1': 'fundamental',
      '2': 'medio', 
      '3': 'tecnico',
      '4': 'superior',
      '5': 'pos-graduacao',
      '6': 'mba',
      '7': 'mestrado',
      '8': 'doutorado',
      '9': 'pos-doutorado',
    };

    if (!conversationState.tempData) {
      setConversationState(prev => ({ ...prev, tempData: {} }));
    }

    switch (currentSubStep) {
      case 'selectLevel':
        const levelKey = Object.keys(educationLevels).find(key => 
          input === key || input.toLowerCase().includes(educationLevels[key as keyof typeof educationLevels])
        );
        
        if (levelKey) {
          setConversationState(prev => ({
            ...prev,
            tempData: { ...prev.tempData, level: educationLevels[levelKey as keyof typeof educationLevels] }
          }));
          nextMessage = `**${ResumeService.getEducationLevelDisplay(educationLevels[levelKey as keyof typeof educationLevels])}** selecionado! 📚\n\n**Nome da Instituição:**`;
          nextSubStep = 'institution';
        } else {
          nextMessage = 'Por favor, escolha uma opção válida (1-9) ou digite o nome do nível:';
          nextSubStep = 'selectLevel';
        }
        break;

      case 'institution':
        setConversationState(prev => ({
          ...prev,
          tempData: { ...prev.tempData, institution: input }
        }));
        nextMessage = `**Nome do Curso:**`;
        nextSubStep = 'course';
        break;

      case 'course':
        setConversationState(prev => ({
          ...prev,
          tempData: { ...prev.tempData, course: input }
        }));
        nextMessage = `**Data de início e conclusão:**\n\nExemplo: "2020 - 2024" ou "2022 - Cursando"`;
        nextSubStep = 'dates';
        break;

      case 'dates':
        const dates = input.split(' - ');
        if (dates.length === 2) {
          const newEducation: Education = {
            id: Date.now().toString(),
            level: conversationState.tempData?.level || 'superior',
            institution: conversationState.tempData?.institution || '',
            course: conversationState.tempData?.course || '',
            startDate: dates[0].trim(),
            endDate: dates[1].trim(),
          };

          setConversationState(prev => ({
            ...prev,
            resumeData: {
              ...prev.resumeData,
              education: [...(prev.resumeData.education || []), newEducation],
            },
            tempData: {},
          }));

          nextMessage = `Formação adicionada com sucesso! ✅\n\n**Você gostaria de adicionar outra formação?** (Sim/Não)`;
          nextSubStep = 'addMore';
        } else {
          nextMessage = 'Por favor, use o formato "Ano Início - Ano Fim" (exemplo: 2020 - 2024):';
          nextSubStep = 'dates';
        }
        break;

      case 'addMore':
        if (input.toLowerCase().includes('sim') || input.toLowerCase().includes('s')) {
          nextMessage = `**Qual nível de educação você gostaria de adicionar?**\n\n1️⃣ Ensino Fundamental\n2️⃣ Ensino Médio\n3️⃣ Curso Técnico\n4️⃣ Ensino Superior\n5️⃣ Pós-graduação/Especialização\n6️⃣ MBA\n7️⃣ Mestrado\n8️⃣ Doutorado\n9️⃣ Pós-Doutorado\n\nDigite o número ou nome da opção:`;
          nextSubStep = 'selectLevel';
        } else {
          nextMessage = `**Perfeito! Agora vamos para suas experiências profissionais! 💼**\n\n**Gostaria de adicionar uma experiência profissional?** (Sim/Não)`;
          setConversationState(prev => ({ ...prev, currentStep: 'experience' }));
          nextSubStep = 'addExperience';
        }
        break;
    }

    const parsedContent = GeminiService.extractCodeBlocks(nextMessage);
    const aiMessage: Message = {
      id: generateUniqueId(),
      text: nextMessage,
      isUser: false,
      timestamp: new Date(),
      parsedContent,
    };

    setMessages(prev => [...prev, aiMessage]);
    setConversationState(prev => ({ ...prev, currentSubStep: nextSubStep }));
  };

  const handleExperienceStep = async (input: string) => {
    // Implementation similar to education but for work experience
    // This would handle company, position, dates, and description
    // For brevity, I'll implement key parts
    
    const { currentSubStep } = conversationState;
    let nextMessage = '';
    let nextSubStep = '';

    // Simplified implementation - would be expanded with full logic
    if (currentSubStep === 'addExperience') {
      if (input.toLowerCase().includes('não') || input.toLowerCase().includes('nao')) {
        nextMessage = `**Sem problemas! Vamos para os projetos pessoais/acadêmicos! 🚀**\n\n**Você tem algum projeto pessoal ou acadêmico relevante que gostaria de destacar?** (Sim/Não)`;
        setConversationState(prev => ({ ...prev, currentStep: 'projects' }));
        nextSubStep = 'addProject';
      } else {
        nextMessage = `**Nome da Empresa:**`;
        nextSubStep = 'company';
      }
    }

    const parsedContent = GeminiService.extractCodeBlocks(nextMessage);
    const aiMessage: Message = {
      id: generateUniqueId(),
      text: nextMessage,
      isUser: false,
      timestamp: new Date(),
      parsedContent,
    };

    setMessages(prev => [...prev, aiMessage]);
    setConversationState(prev => ({ ...prev, currentSubStep: nextSubStep }));
  };

  const handleProjectsStep = async (input: string) => {
    // Similar implementation for projects
    const { currentSubStep } = conversationState;
    let nextMessage = `**Vamos para os idiomas! 🌍**\n\n**Qual idioma você gostaria de adicionar?**`;
    
    setConversationState(prev => ({ 
      ...prev, 
      currentStep: 'languages',
      currentSubStep: 'addLanguage'
    }));

    const parsedContent = GeminiService.extractCodeBlocks(nextMessage);
    const aiMessage: Message = {
      id: generateUniqueId(),
      text: nextMessage,
      isUser: false,
      timestamp: new Date(),
      parsedContent,
    };

    setMessages(prev => [...prev, aiMessage]);
  };

  const handleLanguagesStep = async (input: string) => {
    // Implementation for languages
    const nextMessage = `**Agora vamos para certificações! 🏆**\n\n**Você possui cursos ou certificados importantes para a sua área?** (Sim/Não)`;
    
    setConversationState(prev => ({ 
      ...prev, 
      currentStep: 'certificates',
      currentSubStep: 'addCertificate'
    }));

    const parsedContent = GeminiService.extractCodeBlocks(nextMessage);
    const aiMessage: Message = {
      id: generateUniqueId(),
      text: nextMessage,
      isUser: false,
      timestamp: new Date(),
      parsedContent,
    };

    setMessages(prev => [...prev, aiMessage]);
  };

  const handleCertificatesStep = async (input: string) => {
    // Implementation for certificates
    const nextMessage = `**Para finalizar, liste suas principais habilidades técnicas e comportamentais!** ⚡\n\n**Exemplo:** Pacote Office, Comunicação Efetiva, Python, Proatividade, React Native\n\n(Separe por vírgulas)`;
    
    setConversationState(prev => ({ 
      ...prev, 
      currentStep: 'skills',
      currentSubStep: 'addSkills'
    }));

    const parsedContent = GeminiService.extractCodeBlocks(nextMessage);
    const aiMessage: Message = {
      id: generateUniqueId(),
      text: nextMessage,
      isUser: false,
      timestamp: new Date(),
      parsedContent,
    };

    setMessages(prev => [...prev, aiMessage]);
  };

  const handleSkillsStep = async (input: string) => {
    const skills = input.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0);
    
    setConversationState(prev => ({
      ...prev,
      resumeData: {
        ...prev.resumeData,
        skills,
      },
      currentStep: 'review',
    }));

    const nextMessage = `**🎉 Parabéns! Seu currículo está pronto!**\n\nDigite **"preview"** para ver a versão final ou **"download"** para baixar nos formatos disponíveis (PDF, DOC, DOCX).\n\n**Gostaria de revisar alguma seção específica?** Digite o nome da seção (ex: "experiência", "educação") ou **"finalizar"** se está tudo certo!`;

    const parsedContent = GeminiService.extractCodeBlocks(nextMessage);
    const aiMessage: Message = {
      id: generateUniqueId(),
      text: nextMessage,
      isUser: false,
      timestamp: new Date(),
      parsedContent,
    };

    setMessages(prev => [...prev, aiMessage]);
  };

  const handleReviewStep = async (input: string) => {
    const trimmedInput = input.trim().toLowerCase();
    
    if (trimmedInput === 'download' || trimmedInput === 'baixar') {
      const nextMessage = `**📁 Formato de Download**\n\nEm qual formato você gostaria de baixar seu currículo?\n\n📄 **PDF** - Ideal para envio\n📝 **DOC** - Word (versão antiga)\n📄 **DOCX** - Word (versão moderna)\n\nDigite o formato desejado:`;
      
      const parsedContent = GeminiService.extractCodeBlocks(nextMessage);
      const aiMessage: Message = {
        id: Date.now().toString(),
        text: nextMessage,
        isUser: false,
        timestamp: new Date(),
        parsedContent,
      };

      setMessages(prev => [...prev, aiMessage]);
    } else if (['pdf', 'doc', 'docx'].includes(trimmedInput)) {
      // Simulate download
      Alert.alert(
        'Download Iniciado',
        `Seu currículo está sendo gerado no formato ${trimmedInput.toUpperCase()}. Em breve estará disponível para download!`,
        [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]
      );
    } else {
      showPreview();
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const timestamp = new Date();
    const userMessage: Message = {
      id: generateUniqueId(),
      text: inputText.trim(),
      isUser: true,
      timestamp,
    };

    const currentMessage = inputText.trim();
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    startTypingAnimation();

    try {
      await processUserInput(currentMessage);
    } catch (error) {
      console.error('Erro ao processar entrada:', error);
      
      const errorMessage: Message = {
        id: generateUniqueId(),
        text: 'Desculpe, ocorreu um erro. Tente novamente.',
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      stopTypingAnimation();
      setIsLoading(false);
    }
  };

  const renderMessage = ({ item, index }: { item: Message; index: number }) => (
    <View 
      key={`message-${item.id}-${index}`}
      style={[
        styles.messageContainer,
        item.isUser ? styles.userMessage : styles.aiMessage,
      ]}
    >
      {!item.isUser && (
        <View style={styles.aiAvatar}>
          <LinearGradient
            colors={item.isPreview ? ['#10b981', '#059669'] : ['#8b5cf6', '#3b82f6']}
            style={styles.avatarGradient}
          >
            <Ionicons 
              name={item.isPreview ? "document-text" : "person"} 
              size={16} 
              color="#fff" 
            />
          </LinearGradient>
        </View>
      )}
      
      <View style={[
        styles.messageBubble,
        item.isUser ? styles.userBubble : styles.aiBubble,
        item.isPreview && styles.previewBubble,
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
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#1f2937" />
        </TouchableOpacity>
        
        <View style={styles.headerInfo}>
          <View style={styles.aiHeaderAvatar}>
            <LinearGradient
              colors={['#8b5cf6', '#3b82f6']}
              style={styles.headerAvatarGradient}
            >
              <Ionicons name="document-text" size={20} color="#fff" />
            </LinearGradient>
          </View>
          <View>
            <Text style={styles.headerTitle}>Assistente de Currículo</Text>
            <Text style={styles.headerSubtitle}>Criação guiada</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.previewButton}
          onPress={showPreview}
        >
          <Ionicons name="eye-outline" size={20} color="#6b7280" />
        </TouchableOpacity>
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
          keyExtractor={(item, index) => `message-${item.id}-${index}-${item.timestamp.getTime()}`}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContainer}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={isTyping ? <TypingIndicator /> : null}
        />

        {/* Input */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              placeholder="Digite sua resposta ou 'preview' para visualizar..."
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
              placeholderTextColor="#9ca3af"
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                inputText.trim() && !isLoading ? styles.sendButtonActive : null,
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
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#6b7280',
  },
  previewButton: {
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
  previewBubble: {
    borderColor: '#10b981',
    backgroundColor: '#f0fdf4',
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