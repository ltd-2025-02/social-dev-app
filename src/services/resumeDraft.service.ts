import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { ConversationState } from '../types/resume';

export interface ResumeDraft {
  id: string;
  userId: string;
  conversationState: ConversationState;
  messages: Array<{
    id: string;
    text: string;
    isUser: boolean;
    timestamp: string;
  }>;
  lastModified: string;
  progress: number; // 0-100
  currentStepName: string;
}

class ResumeDraftService {
  private static readonly DRAFT_KEY = '@socialdev_resume_draft';
  private static readonly NOTIFICATION_ID = 'resume_draft_reminder';

  /**
   * Salva um rascunho de currículo
   */
  async saveDraft(
    userId: string,
    conversationState: ConversationState,
    messages: any[],
    progress: number = 0
  ): Promise<void> {
    try {
      const draft: ResumeDraft = {
        id: `draft_${Date.now()}`,
        userId,
        conversationState,
        messages: messages.map(msg => ({
          ...msg,
          timestamp: msg.timestamp instanceof Date ? msg.timestamp.toISOString() : msg.timestamp
        })),
        lastModified: new Date().toISOString(),
        progress,
        currentStepName: this.getStepDisplayName(conversationState.currentStep)
      };

      await AsyncStorage.setItem(
        `${ResumeDraftService.DRAFT_KEY}_${userId}`,
        JSON.stringify(draft)
      );

      console.log('📄 Rascunho de currículo salvo:', {
        progress: `${progress}%`,
        step: draft.currentStepName
      });

      // Agendar notificação lembrando para continuar
      await this.scheduleReminderNotification();

    } catch (error) {
      console.error('Erro ao salvar rascunho:', error);
    }
  }

  /**
   * Carrega um rascunho salvo
   */
  async loadDraft(userId: string): Promise<ResumeDraft | null> {
    try {
      const draftJson = await AsyncStorage.getItem(`${ResumeDraftService.DRAFT_KEY}_${userId}`);
      
      if (!draftJson) {
        return null;
      }

      const draft: ResumeDraft = JSON.parse(draftJson);
      
      // Converter timestamps de volta para Date objects
      draft.messages = draft.messages.map(msg => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }));

      console.log('📄 Rascunho carregado:', {
        progress: `${draft.progress}%`,
        step: draft.currentStepName
      });

      return draft;

    } catch (error) {
      console.error('Erro ao carregar rascunho:', error);
      return null;
    }
  }

  /**
   * Verifica se existe um rascunho para o usuário
   */
  async hasDraft(userId: string): Promise<boolean> {
    try {
      const draft = await this.loadDraft(userId);
      return draft !== null && draft.progress < 100;
    } catch (error) {
      console.error('Erro ao verificar rascunho:', error);
      return false;
    }
  }

  /**
   * Remove um rascunho
   */
  async deleteDraft(userId: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(`${ResumeDraftService.DRAFT_KEY}_${userId}`);
      await this.cancelReminderNotification();
      console.log('🗑️ Rascunho removido');
    } catch (error) {
      console.error('Erro ao remover rascunho:', error);
    }
  }

  /**
   * Calcula o progresso baseado no estado da conversa
   */
  calculateProgress(conversationState: ConversationState): number {
    const steps = ['intro', 'personal', 'education', 'experience', 'projects', 'skills', 'languages', 'certificates', 'summary'];
    const currentStepIndex = steps.indexOf(conversationState.currentStep);
    
    if (currentStepIndex === -1) return 0;
    
    let progress = (currentStepIndex / (steps.length - 1)) * 100;
    
    // Adicionar progresso detalhado dentro do step atual
    if (conversationState.currentStep === 'personal') {
      const personalFields = ['fullName', 'email', 'phone', 'address'];
      const currentSubStepIndex = personalFields.indexOf(conversationState.currentSubStep || '');
      if (currentSubStepIndex > 0) {
        progress += (currentSubStepIndex / personalFields.length) * (100 / steps.length);
      }
    }
    
    return Math.min(100, Math.round(progress));
  }

  /**
   * Agenda notificação de lembrete
   */
  private async scheduleReminderNotification(): Promise<void> {
    try {
      // Cancelar notificação anterior
      await this.cancelReminderNotification();

      // Agendar nova notificação para 2 horas
      const trigger = new Date();
      trigger.setHours(trigger.getHours() + 2);

      await Notifications.scheduleNotificationAsync({
        identifier: ResumeDraftService.NOTIFICATION_ID,
        content: {
          title: '📄 Currículo Pendente',
          body: 'Você tem um currículo em andamento! Continue de onde parou para não perder seu progresso.',
          data: {
            type: 'resume_draft',
            action: 'continue'
          },
        },
        trigger,
      });

      console.log('🔔 Notificação de lembrete agendada para:', trigger);

    } catch (error) {
      console.error('Erro ao agendar notificação:', error);
    }
  }

  /**
   * Cancela notificação de lembrete
   */
  private async cancelReminderNotification(): Promise<void> {
    try {
      await Notifications.cancelScheduledNotificationAsync(ResumeDraftService.NOTIFICATION_ID);
    } catch (error) {
      console.error('Erro ao cancelar notificação:', error);
    }
  }

  /**
   * Obtém nome amigável do step atual
   */
  private getStepDisplayName(step: string): string {
    const stepNames: Record<string, string> = {
      'intro': 'Introdução',
      'personal': 'Informações Pessoais',
      'education': 'Formação Acadêmica',
      'experience': 'Experiência Profissional',
      'projects': 'Projetos',
      'skills': 'Habilidades',
      'languages': 'Idiomas',
      'certificates': 'Certificações',
      'summary': 'Resumo Final'
    };

    return stepNames[step] || step;
  }

  /**
   * Obtém estatísticas do rascunho
   */
  async getDraftStats(userId: string): Promise<{
    hasActiveDraft: boolean;
    progress: number;
    currentStep: string;
    lastModified: Date | null;
    timeElapsed: string;
  } | null> {
    try {
      const draft = await this.loadDraft(userId);
      
      if (!draft) {
        return {
          hasActiveDraft: false,
          progress: 0,
          currentStep: '',
          lastModified: null,
          timeElapsed: ''
        };
      }

      const lastModified = new Date(draft.lastModified);
      const now = new Date();
      const diffMs = now.getTime() - lastModified.getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

      let timeElapsed = '';
      if (diffHours > 0) {
        timeElapsed = `${diffHours}h${diffMinutes > 0 ? ` ${diffMinutes}min` : ''} atrás`;
      } else if (diffMinutes > 0) {
        timeElapsed = `${diffMinutes} min atrás`;
      } else {
        timeElapsed = 'Agora mesmo';
      }

      return {
        hasActiveDraft: draft.progress < 100,
        progress: draft.progress,
        currentStep: draft.currentStepName,
        lastModified,
        timeElapsed
      };

    } catch (error) {
      console.error('Erro ao obter estatísticas:', error);
      return null;
    }
  }
}

export const resumeDraftService = new ResumeDraftService();