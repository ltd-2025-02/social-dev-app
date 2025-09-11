import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { statsService, UserStats, GlobalStats } from '../../services/stats.service';

interface StatsState {
  userStats: UserStats | null;
  globalStats: GlobalStats | null;
  recentActivity: any[];
  loading: boolean;
  error: string | null;
}

const initialState: StatsState = {
  userStats: null,
  globalStats: null,
  recentActivity: [],
  loading: false,
  error: null,
};

// Async Thunks
export const fetchUserStats = createAsyncThunk(
  'stats/fetchUserStats',
  async (userId: string) => {
    return await statsService.getUserStats(userId);
  }
);

export const fetchGlobalStats = createAsyncThunk(
  'stats/fetchGlobalStats',
  async () => {
    return await statsService.getGlobalStats();
  }
);

export const fetchRecentActivity = createAsyncThunk(
  'stats/fetchRecentActivity',
  async (userId: string) => {
    return await statsService.getRecentActivity(userId);
  }
);

const statsSlice = createSlice({
  name: 'stats',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearStats: (state) => {
      state.userStats = null;
      state.globalStats = null;
      state.recentActivity = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // User Stats
      .addCase(fetchUserStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserStats.fulfilled, (state, action) => {
        state.loading = false;
        state.userStats = action.payload;
      })
      .addCase(fetchUserStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao carregar estatísticas do usuário';
      })
      
      // Global Stats
      .addCase(fetchGlobalStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGlobalStats.fulfilled, (state, action) => {
        state.loading = false;
        state.globalStats = action.payload;
      })
      .addCase(fetchGlobalStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao carregar estatísticas globais';
      })
      
      // Recent Activity
      .addCase(fetchRecentActivity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecentActivity.fulfilled, (state, action) => {
        state.loading = false;
        state.recentActivity = action.payload;
      })
      .addCase(fetchRecentActivity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Erro ao carregar atividades recentes';
      });
  },
});

export const { clearError, clearStats } = statsSlice.actions;
export default statsSlice.reducer;