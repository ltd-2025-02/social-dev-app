import { supabase } from '../services/supabase';

export const checkNetworkConnection = async (): Promise<boolean> => {
  try {
    // Tenta fazer uma requisição simples para verificar conectividade
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    return !error;
  } catch (error) {
    console.error('❌ Erro de rede detectado:', error);
    return false;
  }
};

export const retryWithExponentialBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> => {
  let attempt = 0;
  
  while (attempt < maxRetries) {
    try {
      return await fn();
    } catch (error: any) {
      attempt++;
      
      if (attempt >= maxRetries) {
        throw error;
      }
      
      const delay = baseDelay * Math.pow(2, attempt - 1);
      console.log(`⏳ Tentativa ${attempt} falhou, tentando novamente em ${delay}ms...`);
      
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw new Error('Max retries exceeded');
};

export const isNetworkError = (error: any): boolean => {
  const networkErrorMessages = [
    'Network request failed',
    'fetch failed',
    'Failed to fetch',
    'NetworkError',
    'NETWORK_ERROR',
    'Connection refused',
    'Connection timeout',
    'Request timeout',
  ];
  
  if (!error?.message) return false;
  
  const errorMessage = error.message.toLowerCase();
  return networkErrorMessages.some(msg => errorMessage.includes(msg.toLowerCase()));
};