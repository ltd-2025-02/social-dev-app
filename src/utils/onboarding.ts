import AsyncStorage from '@react-native-async-storage/async-storage';

const ONBOARDING_KEY = 'onboarding_completed';

export const onboardingUtils = {
  /**
   * Verifica se o onboarding já foi concluído pelo usuário
   */
  async hasCompletedOnboarding(): Promise<boolean> {
    try {
      const value = await AsyncStorage.getItem(ONBOARDING_KEY);
      return value === 'true';
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      return false;
    }
  },

  /**
   * Marca o onboarding como concluído
   */
  async completeOnboarding(): Promise<void> {
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      throw error;
    }
  },

  /**
   * Reset do onboarding (útil para desenvolvimento/testes)
   */
  async resetOnboarding(): Promise<void> {
    try {
      await AsyncStorage.removeItem(ONBOARDING_KEY);
    } catch (error) {
      console.error('Error resetting onboarding:', error);
      throw error;
    }
  },

  /**
   * Verifica se o usuário deve ver o onboarding
   * Considera tanto o status salvo quanto se é um novo usuário
   */
  async shouldShowOnboarding(isNewUser: boolean = false): Promise<boolean> {
    try {
      const hasCompleted = await this.hasCompletedOnboarding();
      
      // Se é um novo usuário e não completou onboarding, deve mostrar
      if (isNewUser && !hasCompleted) {
        return true;
      }
      
      // Se não completou onboarding (independente de ser novo ou não), deve mostrar
      if (!hasCompleted) {
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error checking if should show onboarding:', error);
      return false;
    }
  }
};