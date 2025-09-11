import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase';

export interface UserSettings {
  // Profile Settings
  profile: {
    visibility: 'public' | 'connections' | 'private';
    showEmail: boolean;
    showPhone: boolean;
    showLocation: boolean;
    allowMessages: 'everyone' | 'connections' | 'none';
    allowConnections: boolean;
    showOnlineStatus: boolean;
  };
  
  // Privacy Settings
  privacy: {
    dataCollection: boolean;
    analytics: boolean;
    marketingEmails: boolean;
    twoFactorAuth: boolean;
    loginNotifications: boolean;
  };
  
  // Notification Settings
  notifications: {
    push: boolean;
    email: boolean;
    likes: boolean;
    comments: boolean;
    follows: boolean;
    messages: boolean;
    jobAlerts: boolean;
    postUpdates: boolean;
    connectionRequests: boolean;
    weeklyDigest: boolean;
  };
  
  // App Settings
  app: {
    theme: 'light' | 'dark' | 'system';
    language: 'pt' | 'en' | 'es';
    autoDownloadImages: boolean;
    autoDownloadVideos: boolean;
    dataUsage: 'low' | 'medium' | 'high';
    cacheSize: number; // in MB
    syncFrequency: 'real-time' | 'hourly' | 'daily';
  };
  
  // Content Settings
  content: {
    maturityFilter: boolean;
    hideSensitiveContent: boolean;
    autoPlayVideos: boolean;
    showReadingTime: boolean;
    compactView: boolean;
  };
}

const DEFAULT_SETTINGS: UserSettings = {
  profile: {
    visibility: 'public',
    showEmail: false,
    showPhone: false,
    showLocation: true,
    allowMessages: 'connections',
    allowConnections: true,
    showOnlineStatus: true,
  },
  privacy: {
    dataCollection: true,
    analytics: true,
    marketingEmails: false,
    twoFactorAuth: false,
    loginNotifications: true,
  },
  notifications: {
    push: true,
    email: true,
    likes: true,
    comments: true,
    follows: true,
    messages: true,
    jobAlerts: true,
    postUpdates: false,
    connectionRequests: true,
    weeklyDigest: true,
  },
  app: {
    theme: 'system',
    language: 'pt',
    autoDownloadImages: true,
    autoDownloadVideos: false,
    dataUsage: 'medium',
    cacheSize: 100,
    syncFrequency: 'real-time',
  },
  content: {
    maturityFilter: true,
    hideSensitiveContent: false,
    autoPlayVideos: true,
    showReadingTime: true,
    compactView: false,
  },
};

class SettingsService {
  private static readonly STORAGE_KEY = '@socialdev_settings';
  
  /**
   * Carrega as configurações do usuário
   */
  async loadSettings(userId: string): Promise<UserSettings> {
    try {
      console.log('📋 Carregando configurações para o usuário:', userId);
      
      // Primeiro, tentar carregar do AsyncStorage (cache local)
      const localSettings = await this.loadLocalSettings();
      
      // Depois, tentar carregar do Supabase
      const { data: remoteSettings, error } = await supabase
        .from('user_settings')
        .select('settings')
        .eq('user_id', userId)
        .single();
      
      if (error && error.code !== 'PGRST116') { // PGRST116 = No rows found
        console.error('Erro ao carregar configurações remotas:', error);
        return localSettings || DEFAULT_SETTINGS;
      }
      
      if (remoteSettings?.settings) {
        // Mesclar configurações remotas com padrões para garantir que todas as chaves existam
        const mergedSettings = this.mergeWithDefaults(remoteSettings.settings);
        
        // Salvar no cache local
        await this.saveLocalSettings(mergedSettings);
        
        return mergedSettings;
      }
      
      // Se não há configurações remotas, usar locais ou padrões
      return localSettings || DEFAULT_SETTINGS;
      
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
      return DEFAULT_SETTINGS;
    }
  }
  
  /**
   * Salva as configurações do usuário
   */
  async saveSettings(userId: string, settings: UserSettings): Promise<void> {
    try {
      console.log('💾 Salvando configurações para o usuário:', userId);
      
      // Salvar no AsyncStorage primeiro (rápido)
      await this.saveLocalSettings(settings);
      
      // Depois salvar no Supabase
      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: userId,
          settings: settings,
          updated_at: new Date().toISOString()
        });
      
      if (error) {
        console.error('Erro ao salvar configurações remotas:', error);
        throw error;
      }
      
      console.log('✅ Configurações salvas com sucesso');
      
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      throw error;
    }
  }
  
  /**
   * Atualiza uma configuração específica
   */
  async updateSetting<K extends keyof UserSettings>(
    userId: string,
    category: K,
    key: keyof UserSettings[K],
    value: any
  ): Promise<void> {
    try {
      const currentSettings = await this.loadSettings(userId);
      
      // Atualizar a configuração específica
      (currentSettings[category] as any)[key] = value;
      
      await this.saveSettings(userId, currentSettings);
      
    } catch (error) {
      console.error('Erro ao atualizar configuração:', error);
      throw error;
    }
  }
  
  /**
   * Reseta as configurações para os padrões
   */
  async resetSettings(userId: string): Promise<void> {
    try {
      console.log('🔄 Resetando configurações para padrões');
      
      await this.saveSettings(userId, DEFAULT_SETTINGS);
      
    } catch (error) {
      console.error('Erro ao resetar configurações:', error);
      throw error;
    }
  }
  
  /**
   * Exporta as configurações
   */
  async exportSettings(userId: string): Promise<string> {
    try {
      const settings = await this.loadSettings(userId);
      return JSON.stringify(settings, null, 2);
    } catch (error) {
      console.error('Erro ao exportar configurações:', error);
      throw error;
    }
  }
  
  /**
   * Importa as configurações
   */
  async importSettings(userId: string, settingsJson: string): Promise<void> {
    try {
      const settings = JSON.parse(settingsJson) as UserSettings;
      const mergedSettings = this.mergeWithDefaults(settings);
      
      await this.saveSettings(userId, mergedSettings);
      
    } catch (error) {
      console.error('Erro ao importar configurações:', error);
      throw error;
    }
  }
  
  /**
   * Limpa o cache de configurações
   */
  async clearCache(): Promise<void> {
    try {
      await AsyncStorage.removeItem(SettingsService.STORAGE_KEY);
      console.log('🗑️ Cache de configurações limpo');
    } catch (error) {
      console.error('Erro ao limpar cache:', error);
    }
  }
  
  // Métodos privados
  
  private async loadLocalSettings(): Promise<UserSettings | null> {
    try {
      const settingsJson = await AsyncStorage.getItem(SettingsService.STORAGE_KEY);
      if (settingsJson) {
        return JSON.parse(settingsJson);
      }
      return null;
    } catch (error) {
      console.error('Erro ao carregar configurações locais:', error);
      return null;
    }
  }
  
  private async saveLocalSettings(settings: UserSettings): Promise<void> {
    try {
      await AsyncStorage.setItem(
        SettingsService.STORAGE_KEY, 
        JSON.stringify(settings)
      );
    } catch (error) {
      console.error('Erro ao salvar configurações locais:', error);
    }
  }
  
  private mergeWithDefaults(settings: Partial<UserSettings>): UserSettings {
    return {
      profile: { ...DEFAULT_SETTINGS.profile, ...settings.profile },
      privacy: { ...DEFAULT_SETTINGS.privacy, ...settings.privacy },
      notifications: { ...DEFAULT_SETTINGS.notifications, ...settings.notifications },
      app: { ...DEFAULT_SETTINGS.app, ...settings.app },
      content: { ...DEFAULT_SETTINGS.content, ...settings.content },
    };
  }
}

export const settingsService = new SettingsService();