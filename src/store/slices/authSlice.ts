
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { supabase } from '../../services/supabase';
import { checkNetworkConnection, retryWithExponentialBackoff, isNetworkError } from '../../utils/networkUtils';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string | null;
  persona_id?: string | null;
  occupation?: string | null;
  company?: string | null;
  bio?: string | null;
  skills?: any[];
  location?: string | null;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false,
};

// Async thunks
export const signIn = createAsyncThunk(
  'auth/signIn',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      console.log('🔐 Tentando fazer login...');
      
      // Verifica conectividade antes de tentar login
      const isConnected = await checkNetworkConnection();
      if (!isConnected) {
        return rejectWithValue('Sem conexão com a internet. Verifique sua rede e tente novamente.');
      }
      
      const { data, error } = await retryWithExponentialBackoff(async () => {
        const result = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (result.error) throw result.error;
        return result;
      }, 2);


      console.log('✅ Login bem-sucedido, buscando perfil...');

      // Get user profile with retry mechanism
      let profile = null;
      let retries = 3;
      
      while (retries > 0) {
        try {
          const { data: profileData, error: profileError } = await supabase
            .from('users')
            .select('*')
            .eq('id', data.user.id)
            .single();

          if (profileError) {
            console.warn(`⚠️  Erro ao buscar perfil (tentativas restantes: ${retries - 1}):`, profileError);
            if (retries === 1) {
              // Se é a última tentativa e ainda há erro, continua sem perfil
              console.log('⚠️  Continuando sem dados do perfil');
              break;
            }
            retries--;
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1s before retry
            continue;
          }

          profile = profileData;
          console.log('✅ Perfil carregado com sucesso');
          break;
        } catch (profileErr) {
          console.warn(`⚠️  Erro de rede ao buscar perfil (tentativas restantes: ${retries - 1}):`, profileErr);
          retries--;
          if (retries > 0) {
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1s before retry
          }
        }
      }

      const userData = {
        id: data.user.id,
        email: data.user.email!,
        name: profile?.name || data.user.email!.split('@')[0],
        avatar: profile?.avatar,
        persona_id: profile?.persona_id,
        occupation: profile?.occupation,
        company: profile?.company,
        bio: profile?.bio,
        skills: profile?.skills,
        location: profile?.location,
      };

      console.log('✅ Login completo:', userData);
      return userData;

    } catch (error: any) {
      console.error('❌ Erro geral no login:', error);
      
      // Tratamento específico para diferentes tipos de erro
      let errorMessage = 'Erro ao fazer login';
      
      if (isNetworkError(error)) {
        errorMessage = 'Erro de conexão. Verifique sua internet e tente novamente.';
      } else if (error?.message?.includes('Invalid login credentials')) {
        errorMessage = 'Email ou senha incorretos.';
      } else if (error?.message?.includes('Email not confirmed')) {
        errorMessage = 'Por favor, confirme seu email antes de fazer login.';
      } else if (error?.message?.includes('Too many requests')) {
        errorMessage = 'Muitas tentativas. Tente novamente em alguns minutos.';
      } else if (error?.message) {
        errorMessage = error.message;
      }

      return rejectWithValue(errorMessage);
    }
  }
);

export const signUp = createAsyncThunk(
  'auth/signUp',
  async ({ email, password, name }: { email: string; password: string; name: string }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2563eb&color=fff`,
        },
      },
    });

    if (error) throw error;

    return {
      id: data.user!.id,
      email: data.user!.email!,
      name,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2563eb&color=fff`,
    };
  }
);

export const signOut = createAsyncThunk('auth/signOut', async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
});

export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser', 
  async (_, { rejectWithValue }) => {
    try {
      console.log('🔍 Checking current session...');
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.log('❌ Session error:', sessionError);
        if (sessionError.message?.includes('refresh_token_not_found')) {
          console.log('🔄 Refresh token not found, clearing session');
          await supabase.auth.signOut();
          return null;
        }
        throw sessionError;
      }
      
      if (!session?.user) {
        console.log('🚫 No active session found');
        return null;
      }

      console.log('✅ Valid session found for user:', session.user.email);

      let profile = null;
      try {
        const { data: profileData, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profileError) {
          console.warn('⚠️  Profile fetch error (continuing without profile):', profileError);
        } else {
          profile = profileData;
        }
      } catch (profileErr) {
        console.warn('⚠️  Profile fetch exception (continuing without profile):', profileErr);
      }

      const userData = {
        id: session.user.id,
        email: session.user.email!,
        name: profile?.name || session.user.email!.split('@')[0],
        avatar: profile?.avatar,
        persona_id: profile?.persona_id,
        occupation: profile?.occupation,
        company: profile?.company,
        bio: profile?.bio,
        skills: profile?.skills,
        location: profile?.location,
      };

      console.log('✅ Current user loaded:', userData);
      return userData;

    } catch (error: any) {
      console.error('❌ Get current user error:', error);
      
      if (error?.message?.includes('refresh_token_not_found')) {
        console.log('🔄 Clearing invalid session');
        await supabase.auth.signOut();
        return null;
      }
      
      return rejectWithValue(error.message || 'Failed to get current user');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    // Sign In
    builder
      .addCase(signIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao fazer login';
      })
      
    // Sign Up
      .addCase(signUp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao criar conta';
      })
      
    // Sign Out
      .addCase(signOut.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      
    // Get Current User
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.user = action.payload;
          state.isAuthenticated = true;
        } else {
          state.user = null;
          state.isAuthenticated = false;
        }
      })
      .addCase(getCurrentUser.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export const { clearError, updateProfile } = authSlice.actions;
export default authSlice.reducer;
